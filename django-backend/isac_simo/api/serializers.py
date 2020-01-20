import json
from rest_framework import serializers
from .models import Image, ImageFile
from main.models import User

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
        fields = ('file',)

class ImageSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField(read_only=True)
    user_type = serializers.SerializerMethodField(read_only=True)
    image_files = ImageFileSerializer(many=True, read_only=True)
    
    class Meta:
        model = Image
        fields = ('id','url','title','description','user_id','user_name','user_type','image_files','created_at','updated_at')
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
        image = Image.objects.create(title=validated_data.get('title'),
                                    description=validated_data.get('description'),
                                    user_id=user.id)
        for image_file in image_files.values():
            ImageFile.objects.create(image=image, file=image_file)
        return image

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)

        image_files = self.context.get('view').request.FILES
        for image_file in image_files.values():
            ImageFile.objects.create(image=instance, file=image_file)
        instance.save()
        return instance