from http.client import HTTPResponse

from django.contrib import messages
from django.shortcuts import redirect, render

from .forms import ImageForm
from .models import Image


def images(request):
    images = Image.objects.all()
    return render(request, 'image.html',{'images':images})

def addImage(request, id = 0):
    if request.method == "GET":
        form = ImageForm()
        return render(request,"add_image.html",{'form':form})
    elif request.method == "POST":
        form = ImageForm(request.POST or None, request.FILES or None)
        if form.is_valid():
            instance = form.save(commit=False)
            if(request.POST.get('user') is None or request.POST.get('user') == ''):
                instance.user_id = request.user.id
            instance.save()
            messages.success(request, "Image Uploaded Successfully!")
        else:
            messages.error(request, "Invalid Request")
            return render(request,"add_image.html",{'form':form}) 

    return redirect("images")

def updateImage(request, id=0):
    try:
        image = Image.objects.get(id=id)

        if request.method == "GET":
            form = ImageForm(instance=image)
            return render(request,"add_image.html",{'form':form, 'id':id})
        elif request.method == "POST":
            form = ImageForm(request.POST or None, request.FILES or None, instance=image)
            if form.is_valid():
                instance = form.save(commit=False)
                instance.save()
                messages.success(request, "Image Details Edited Successfully!")
            else:
                messages.error(request, "Invalid Request")
                return render(request,"add_image.html",{'form':form, 'id':id}) 

        return redirect("images")
    except(Image.DoesNotExist):
        messages.error(request, "Invalid Image attempted to Edit")
        return redirect("images.add")

def deleteImage(request, id=0):
    try:
        if request.method == "POST":
            image = Image.objects.get(id=id)
            image.image.delete()
            image.delete()
            messages.success(request, 'Image Data Deleted Successfully!')
            return redirect('images')
        else:
            messages.error(request, 'Failed to Delete!')
            return redirect('images')
    except(Projects.DoesNotExist):
        messages.error(request, "Invalid Image attempted to Delete")
        return redirect("images")
