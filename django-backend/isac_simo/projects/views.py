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
        return render(request,"addProject.html",{'form':form})
    elif request.method == "POST":
        projectform = Projects()
        projectform.project_name = request.POST.get('project_name')
        projectform.project_desc = request.POST.get('project_desc')
        projectform.user = User.objects.get(id=request.user.id)

        if request.FILES.get('image'):

            myFile = request.FILES.get('image')
            fs = FileSystemStorage(location="main/media/project_images")
            filename = fs.save(myFile.name, myFile)
            projectform.image = 'project_images/'  + myFile.name    

        projectform.save()
        messages.success(request, "New Project Added Successfully!")       

        return redirect("viewprojects")

def editProject(request, id=0):
    if request.method == "GET":
        project = Projects.objects.get(id=id)
        form = ProjectForm(instance=project)
        return render(request,"addProject.html",{'form':form})
    elif request.method == "POST":
        projectform = Projects.objects.get(id=id)

        projectform.project_name = request.POST.get('project_name')
        projectform.project_desc = request.POST.get('project_desc')
        projectform.project_user = User.objects.get(id=request.user.id)
        
        if request.FILES.get('image'):
            projectform.image.delete()
            myFile = request.FILES.get('image')
            fs = FileSystemStorage(location="main/media/project_images")
            filename = fs.save(myFile.name, myFile)
            projectform.image = 'project_images/'  + myFile.name     
        
        projectform.save()
        messages.info(request,"Project Record Updated Successfully!")

        return redirect("viewprojects")

def deleteProject(request, id):
    project = Projects.objects.get(id=id)
    project.image.delete()
    project.delete()
    messages.error(request, 'Project Deleted Successfully!')

    return redirect('viewprojects')

