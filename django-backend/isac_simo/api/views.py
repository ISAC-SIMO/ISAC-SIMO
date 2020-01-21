from http.client import HTTPResponse

from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponseRedirect
from django.shortcuts import redirect, render
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from api.serializers import ImageSerializer, UserSerializer
from main.authorization import *
from main.models import User

from .forms import ImageForm
from .models import Image, ImageFile
from main import authorization


# View All Images
@user_passes_test(is_admin, login_url=login_url)
def images(request):
    images = Image.objects.all().prefetch_related('image_files')
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
                if(i>=8):
                    break

            messages.success(request, "Image Uploaded Successfully!")
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

        if request.method == "GET":
            form = ImageForm(instance=image)
            return render(request,"add_image.html",{'form':form, 'id':id, 'image_files':image_files})
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
        if(self.request.user.is_admin):
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

class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['post','options']
