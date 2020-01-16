from django.shortcuts import render, redirect
from .models import Projects
from .forms import ProjectForm
from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from main.models import User

def viewProjects(request):
    projects = Projects.objects.all()
    return render(request, 'projects.html',{'projects':projects})

def addProject(request, id = 0):
    if request.method == "GET":
        form = ProjectForm()
        return render(request,"add_project.html",{'form':form})
    elif request.method == "POST":
        form = ProjectForm(request.POST or None, request.FILES or None)
        if form.is_valid():
            instance = form.save(commit=False)
            instance.user = User.objects.get(id=request.user.id)
            instance.save()
            messages.success(request, "New Project Added Successfully!")
        else:
            messages.error(request, "Invalid Request")
            return render(request,"add_project.html",{'form':form})
        # if request.FILES.get('image'):
        #     myFile = request.FILES.get('image')
        #     fs = FileSystemStorage(location="main/media/project_images")
        #     filename = fs.save(myFile.name, myFile)
        #     projectform.image = 'project_images/'  + myFile.name    

    return redirect("viewprojects")

def editProject(request, id=0):
    try:
        project = Projects.objects.get(id=id)

        if request.method == "GET":
            form = ProjectForm(instance=project)
            return render(request,"add_project.html",{'form':form, 'project':project})
        elif request.method == "POST":
            form = ProjectForm(request.POST or None, request.FILES or None, instance=project)
            if form.is_valid():
                instance = form.save(commit=False)
                instance.save()
                messages.success(request, "Project Updated Successfully!")
            else:
                messages.error(request, "Invalid Request")
                return render(request,"add_project.html",{'form':form, 'project':project})

        return redirect("viewprojects")
    except(Projects.DoesNotExist):
        messages.error(request, "Invalid Project attempted to Edit")
        return redirect("viewprojects")

def deleteProject(request, id):
    try:
        if request.method == "POST":
            project = Projects.objects.get(id=id)
            project.image.delete()
            project.delete()
            messages.success(request, 'Project Deleted Successfully!')
            return redirect('viewprojects')
        else:
            messages.error(request, 'Failed to Delete!')
            return redirect('viewprojects')
    except(Projects.DoesNotExist):
        messages.error(request, "Invalid Project attempted to Delete")
        return redirect("viewprojects")

