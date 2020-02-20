import json
import os
from django.conf import settings
from django.http import HttpResponse
from PIL import Image as PILImage
from rest_framework import serializers
from api.helpers import test_image

from main.models import User

from .models import Image, ImageFile


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    class Meta:
        model = User
        fields = ('id','email','password','full_name','user_type','image')
        read_only_fields = ('id','user_type')

    def create(self, validated_data):
        user = User.objects.create(email=validated_data['email'],
                                full_name=validated_data['full_name'],
                                image=validated_data['image'])
        user.set_password(validated_data['password'])
        user.save()
        return user

class ImageFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageFile
        fields = ('file','tested','result','score')

class ImageSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField(read_only=True)
    user_type = serializers.SerializerMethodField(read_only=True)
    image_files = ImageFileSerializer(many=True, read_only=True)
    
    class Meta:
        model = Image
        fields = ('id','url','title','description','lat','lng','user_id','user_name','user_type','image_files','created_at','updated_at')
        read_only_fields = ('user_name','user_type','created_at', 'updated_at')

    def get_user_name(self, image):
        return image.user.full_name if image.user else None
    
    def get_user_type(self, image):
        return image.user.user_type if image.user else None

    def create(self, validated_data):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        image_files = self.context.get('view').request.FILES

        if len(image_files) > 0 and len(image_files) < 8: # Images count 1 to 7
            image = Image.objects.create(title=validated_data.get('title'),
                                        description=validated_data.get('description'),
                                        lat=validated_data.get('lat'),
                                        lng=validated_data.get('lng'),
                                        user_id=user.id)

            e = 0 # Check if files uploaded or Not
            u = 0 # Uploaded Count
            for image_file in image_files.values():
                try:
                    img = PILImage.open(image_file)
                    img.verify()
                    image_obj = ImageFile.objects.create(image=image, file=image_file)
                    ################
                    ### RUN TEST ###
                    ################
                    test_image(image_obj,validated_data.get('title'),validated_data.get('description'))

                    u = u + 1
                except Exception as err:
                    print('File Failed to Upload - NOT AN IMAGE')
                    e = e + 1
            
            if(u >= 1): # At least one uploaded good to go
                ###############################
                ##### IF FINE TO CONTINUE #####
                ###############################
                return image
            else: # No Files Upload Throw error
                image.delete()
                error = {'message': str(e)+' Files failed to Upload. (Probably, Files are not type Image)'}
                raise serializers.ValidationError(error)
        else:
            error = {'message': 'No Images provided or too much (>7) images provided.'}
            raise serializers.ValidationError(error)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.lat = validated_data.get('lat', instance.lat)
        instance.lng = validated_data.get('lng', instance.lng)
        
        image_files = self.context.get('view').request.FILES
        if len(image_files) > 8:
            e = 0 # Check if files uploaded or Not
            u = 0 # Uploaded Count
            for image_file in image_files.values():
                try:
                    img = PILImage.open(image_file)
                    img.verify()
                    image_obj = ImageFile.objects.create(image=instance, file=image_file)
                    ################
                    ### RUN TEST ###
                    ################
                    test_image(image_obj,validated_data.get('title'),validated_data.get('description'))
                    u = u + 1
                except:
                    print('File Failed to Upload - NOT AN IMAGE')
                    e = e + 1
            
            if(u >= 1): # At least one uploaded good to go
                instance.save()
                return instance
            else: # No Files Upload Throw error
                instance.save()
                error = {'message': str(e)+' Files failed to Upload. (Probably, Files are not type Image)'}
                raise serializers.ValidationError(error)
        else:
            error = {'message': 'Too much (>7) images provided.'}
            raise serializers.ValidationError(error)
