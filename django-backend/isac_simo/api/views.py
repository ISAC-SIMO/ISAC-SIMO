import os
from http.client import HTTPResponse

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render
from rest_framework import generics, mixins, viewsets
from rest_framework.decorators import permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from api.helpers import retrain_image, test_image
from api.serializers import (ImageSerializer, UserSerializer,
                             VideoFrameSerializer)
from main import authorization
from main.authorization import *
from main.models import User

from .forms import ImageForm
from .models import Image, ImageFile


# View All Images
@login_required(login_url=login_url)
def images(request):
    if(is_admin(request.user)):
        images = Image.objects.order_by('-created_at').all().prefetch_related('image_files')
    elif(is_government(request.user)):
        images = Image.objects.order_by('-created_at').all().prefetch_related('image_files')
    else:
        images = Image.objects.filter(user_id=request.user.id).order_by('-created_at').prefetch_related('image_files')
    return render(request, 'image.html',{'images':images})

# Add Image via Dashboard
@user_passes_test(is_admin, login_url=login_url)
def addImage(request, id = 0):
    if request.method == "GET":
        form = ImageForm()
        return render(request,"add_image.html",{'form':form})
    elif request.method == "POST":
        form = ImageForm(request.POST or None, request.FILES or None)
        files = request.FILES.getlist('image')
        if(len(files) <= 0):
            messages.error(request, "No Image Provided")
            return render(request,"add_image.html",{'form':form})

        if form.is_valid():
            instance = form.save(commit=False)
            if(request.POST.get('user') is None or request.POST.get('user') == ''):
                instance.user_id = request.user.id
            instance.save()

            i = 0
            for f in files:
                i = i + 1
                photo = ImageFile(image=instance, file=f)
                photo.save()
                ################
                ### RUN TEST ###
                ################
                test_image(photo,request.POST.get('title'),request.POST.get('description'))
                    
                if(i>=8):
                    break

            messages.success(request, str(i)+" Image(s) Uploaded Successfully!")
        else:
            messages.error(request, "Invalid Request")
            return render(request,"add_image.html",{'form':form}) 

    return redirect("images")

# Update Image + Append File + PATCH
@user_passes_test(is_admin, login_url=login_url)
def updateImage(request, id=0):
    try:
        image = Image.objects.get(id=id)
        image_files = ImageFile.objects.filter(image_id=image.id)
        verified_list = {}
        can_retrain = False
        min_images_to_zip = 10
        if settings.DEBUG:
            min_images_to_zip = 2
        #NOTE: 10 minimum zipped images is required to re-train a go,nogo,etc.. model (calculated below)

        if request.method == "GET":
            for image_file in image_files:
                if image_file.verified and image_file.result and image_file.object_type:
                    # TO CREATE STRUCTURE OF #
                    # {
                    #     "wall":{
                    #         "go": 10,
                    #         "nogo":5,
                    #     },
                    #     "rebar":{
                    #         "10mm": 10,
                    #         "20mm":5,
                    #     }
                    # }
                    verified_list[image_file.object_type.lower()] = verified_list.get(image_file.object_type.lower(),{})
                    verified_list.get(image_file.object_type.lower(),{})[image_file.result.lower()] = verified_list.get(image_file.object_type.lower(),{}).get(image_file.result.lower(),0) + 1
                    # print(verified_list)
                    if verified_list.get(image_file.object_type.lower(),{}).get(image_file.result.lower(),0) >= min_images_to_zip:
                        can_retrain = True

            form = ImageForm(instance=image)
            return render(request,"add_image.html",{'form':form, 'id':id, 'image_files':image_files, 'verified_list':verified_list, 'can_retrain':can_retrain})
        elif request.method == "POST":
            files = request.FILES.getlist('image')
            form = ImageForm(request.POST or None, request.FILES or None, instance=image)
            if form.is_valid():
                instance = form.save(commit=False)
                instance.save()
                i = 0
                for f in files:
                    i = i + 1
                    photo = ImageFile(image=instance, file=f)
                    photo.save()
                    ################
                    ### RUN TEST ###
                    ################
                    test_image(photo,request.POST.get('title'),request.POST.get('description'))

                    if(i>=8):
                        break

                messages.success(request, "Image Details Edited Successfully!")
            else:
                messages.error(request, "Invalid Request")
                return render(request,"add_image.html",{'form':form, 'id':id, 'image_files':image_files}) 

        return redirect("images")
    except(Image.DoesNotExist):
        messages.error(request, "Invalid Image attempted to Edit")
        return redirect("images.add")

# Delete Image
@user_passes_test(is_admin, login_url=login_url)
def deleteImage(request, id=0):
    try:
        if request.method == "POST":
            image = Image.objects.get(id=id)
            for i in image.image_files.all():
                i.file.delete()
                i.delete()
            image.delete()
            messages.success(request, 'Image Data Deleted Successfully!')
            return redirect('images')
        else:
            messages.error(request, 'Failed to Delete!')
            return redirect('images')
    except(Image.DoesNotExist):
        messages.error(request, "Invalid Image attempted to Delete")
        return redirect("images")

# Retrain Images file and send zip to ibm
@user_passes_test(is_admin, login_url=login_url)
def retrainImage(request, id):
    try:
        image = Image.objects.get(id=id)
        image_files = ImageFile.objects.filter(image_id=image.id)
        verified_list = {}
        image_file_list = {}
        image_file_id_list = {}
        can_retrain = False
        min_images_to_zip = 10
        if settings.DEBUG:
            min_images_to_zip = 2
        #NOTE: 10 minimum zipped images is required to re-train a go,nogo,etc.. model (calculated below)

        if request.method != "POST":
            messages.error(request, "Re-Train Request was improperly sent")
            return redirect("images.add")
        elif request.method == "POST":
            for image_file in image_files:
                if image_file.verified and image_file.result and image_file.file and image_file.object_type:
                    verified_list[image_file.object_type.lower()] = verified_list.get(image_file.object_type.lower(),{})
                    verified_list.get(image_file.object_type.lower(),{})[image_file.result.lower()] = verified_list.get(image_file.object_type.lower(),{}).get(image_file.result.lower(),0) + 1
                    # print(verified_list)

                    image_file_list[image_file.object_type.lower()] = image_file_list.get(image_file.object_type.lower(),{})
                    image_file_list.get(image_file.object_type.lower(),{})[image_file.result.lower()] = image_file_list.get(image_file.object_type.lower(),{}).get(image_file.result.lower(),[]) + [image_file.file.url]
                    # print(image_file_list)
                    
                    image_file_id_list[image_file.object_type.lower()] = image_file_id_list.get(image_file.object_type.lower(),{})
                    image_file_id_list.get(image_file.object_type.lower(),{})[image_file.result.lower()] = image_file_id_list.get(image_file.object_type.lower(),{}).get(image_file.result.lower(),[]) + [image_file.id]
                    # print(image_file_id_list)

                    # verified_list[image_file.result.lower()] = verified_list.get(image_file.result.lower(),0) + 1
                    # image_file_list[image_file.result.lower()] = image_file_list.get(image_file.result.lower(),[]) + [image_file.file.url]
                    # image_file_id_list[image_file.result.lower()] = image_file_id_list.get(image_file.result.lower(),[]) + [image_file.id]
                    # print(image_file_list)
                    print(verified_list)

            for p_key, p_value in verified_list.items():
                # print(p_value)
                for key, value in p_value.items():
                    if value >= min_images_to_zip:
                        can_retrain = True
                        print(image_file_list.get(p_key,{}).get(key,[]))
                        # Image File List(arr), object_type, result
                        retrain_response = retrain_image(image_file_list.get(p_key,{}).get(key,[]), p_key, key)

                        if retrain_response:
                            messages.success(request, "Zipped and Sent for Re-Training")
                            # Use id list to update in db - the retrained boolean status
                            print(image_file_id_list.get(p_key,{}).get(key,[]))
                            for id in image_file_id_list.get(p_key,{}).get(key,[]):
                                image_file = ImageFile.objects.get(id=id)
                                image_file.retrained = True
                                image_file.save()
                        else:
                            messages.error(request, "Failed to Re-Train")
                            print('Failed to re-train')
        
        return HttpResponseRedirect(request.META.get('HTTP_REFERER','/'))
    except(Image.DoesNotExist):
        messages.error(request, "This Image Model probably does not exist")
        return redirect("images.add")

# Delete Image Specific File
@user_passes_test(is_admin, login_url=login_url)
def deleteImageFile(request, id):
    try:
        if request.method == "POST":
            image_file = ImageFile.objects.get(id=id)
            image_file.file.delete()
            image_file.delete()
            messages.success(request, 'Image Deleted Successfully!')
            return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
        else:
            messages.error(request, 'Invalid Request!')
            return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    except(ImageFile.DoesNotExist):
        messages.error(request, "Invalid Image File attempted to Delete")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

# Re-Test Image Specific File
@user_passes_test(is_admin, login_url=login_url)
def retestImageFile(request, id):
    try:
        image_file = ImageFile.objects.get(id=id)
        if not image_file.result or not image_file.score:
            test_status = test_image(image_file)
            if test_status:
                messages.success(request, 'Image Tested Successfully.')
            else:
                messages.error(request, 'Testing Image Failed !!')
        else:
            messages.error(request, 'Image was already tested.')
        
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    except(ImageFile.DoesNotExist):
        messages.error(request, "Invalid Image File attempted to Re-test")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

# Re-Test Image Specific File
@user_passes_test(is_admin, login_url=login_url)
def verifyImageFile(request, id):
    try:
        image_file = ImageFile.objects.get(id=id)
        image_file.result = request.POST.get('test-result',image_file.result).lower()
        image_file.score = request.POST.get('test-score',image_file.score)
        image_file.object_type = request.POST.get('test-object-type',image_file.object_type).lower()
        if request.POST.get('test-verified',False):
            image_file.verified = True
        else:
            image_file.verified = False
        image_file.save()

        # NOW TODO: SEND Images to SPSS or continues or IBM AI model and retrain it or something like that

        messages.success(request, "Image File Updated - It is now " + ('verified' if image_file.verified else 'un-verified'))
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    except(ImageFile.DoesNotExist):
        messages.error(request, "Invalid Image File attempted to Verify")
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

#######
# API #
#######

# Images API
class ImageView(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    # permission_classes = [IsAdminUser]

    # TO LIMIT WHAT USER CAN DO - EDIT,SEE,DELETE
    def get_queryset(self):
        if(self.request.user.is_authenticated and self.request.user.is_admin):
            return Image.objects.all()
        return Image.objects.filter(user_id=self.request.user.id)

    # TO LIMIT PERMISSION - I CREATED CUSTOM PERMISSION IN main/authorization.py
    # Files contains checker for Authorization as well as passes test
    # def get_permissions(self):
    #     if self.action == 'list':
    #         self.permission_classes = [HasAdminPermission, ]
    #     elif self.action == 'retrieve':
    #         self.permission_classes = [HasAdminPermission]
    #     return super(self.__class__, self).get_permissions()

    def destroy(self, request, *args, **kwargs):
        image = self.get_object()
        for i in image.image_files.all():
            i.file.delete()
            i.delete()
        return super().destroy(request, *args, **kwargs)

class VideoFrameView(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = VideoFrameSerializer
    http_method_names = ['post', 'head', 'options']

    def get_queryset(self):
        if(self.request.user.is_authenticated and self.request.user.is_admin):
            return Image.objects.all()
        return Image.objects.filter(user_id=self.request.user.id)

    def destroy(self, request, *args, **kwargs):
        image = self.get_object()
        for i in image.image_files.all():
            i.file.delete()
            i.delete()
        return super().destroy(request, *args, **kwargs)

class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['post','options','patch','get']
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        if(self.request.method == "POST"):
            return User.objects.exclude(active__in=[True,False])
        return User.objects.filter(id=self.request.user.id)

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [HasAdminPermission]
        elif self.action == 'retrieve':
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'create':
            self.permission_classes = [HasGuestPermission]
        elif self.action == 'update':
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'partial_update':
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'destroy':
            self.permission_classes = [IsAuthenticated]
        return super(self.__class__, self).get_permissions()

class ProfileView(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    def list(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=self.request.user.id)
        return Response({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "user_type": user.user_type,
            "image":request.scheme + '://' + request.META['HTTP_HOST'] + user.image.url
        })
