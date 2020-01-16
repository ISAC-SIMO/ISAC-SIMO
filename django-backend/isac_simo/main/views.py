from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from .forms import LoginForm, RegisterForm, AdminRegisterForm, AdminEditForm
from django.contrib.auth.decorators import login_required
from .models import User
from django.contrib import messages
from django import forms
from django.core.files.storage import FileSystemStorage

@login_required
def home(request):
    return render(request, 'dashboard.html')

def login_user(request):
    if request.method == "POST":
        user = authenticate(username = request.POST.get('email'), password = request.POST.get('password'))
        if user is not None:
            if request.POST.get('remember') is not None:    
                request.session.set_expiry(1209600)
            login(request, user)
            return redirect('dashboard')
        else:
            form = LoginForm(request.POST)
            messages.error(request, 'Invalid User Credentials')
            return render(request, 'auth/login.html', {'form':form})
    else:
        if not request.user.is_authenticated:
            form = LoginForm()
            return render(request, 'auth/login.html', {'form':form})
        else:
            return redirect('dashboard')

def register(request):
    registerForm = RegisterForm(request.POST or None, request.FILES or None)
    if request.method == "POST":
        if registerForm.is_valid():
            registerForm.staff = True
            registerForm.admin = True
            registerForm.save()
            return redirect('login')
        else:
            messages.error(request, 'Invalid Form Request')
    
    if not request.user.is_authenticated:
        return render(request, "auth/register.html", {"form": registerForm})
    else:
        return redirect('dashboard')

def logout_user(request):
    logout(request)
    messages.success(request, 'Logged Out Successfully')
    return redirect('login')

def list_all_users(request):
    users = User.objects.all()
    return render(request, 'users/allusers.html',{'users':users})


def admin_userAddForm(request, id=0):
    if request.method == "GET":
        if id == 0:
            adminRegisterForm = AdminRegisterForm()
        else:
            edituser = User.objects.get(id=id)
            adminRegisterForm = AdminEditForm(instance=edituser)
        return render(request, "users/admin_register.html", {"form": adminRegisterForm})

    elif request.method == "POST":
        if id == 0:
            form = AdminRegisterForm(request.POST or None, request.FILES or None)

            if form.is_valid():
                form.save()
                messages.success(request, "User Added Successfully!")
            else:
                return render(request, "users/admin_register.html", {"form": form})
        else:
            updateUser = User.objects.get(id=id)
            updateUser.email = request.POST.get('email')
            updateUser.full_name = request.POST.get('full_name')
            updateUser.user_type = request.POST.get('user_type')

            password1 = request.POST.get('password1') 
            password2 = request.POST.get('password2')

            if request.FILES.get('image'):
                updateUser.image.delete()
                myFile = request.FILES.get('image')
                fs = FileSystemStorage(location="mainApp/media/user_images")
                filename = fs.save(myFile.name, myFile)
                updateUser.image = 'user_images/'  + myFile.name
            
            if password1 and password2:
                if password1 != password2:
                    messages.info(request, "Password Mismatch")
                    return redirect(request.META['HTTP_REFERER'])
                else:
                    updateUser.set_password(password1)
            else:
                if password1 or password2:
                    messages.info(request, "Fill up password in bsoth the fields")
                    return redirect(request.META['HTTP_REFERER'])

            updateUser.save()

            messages.info(request,"User Record Updated Successfully!")

        return redirect("allusers")


def deleteUserByAdmin(request, id):
    if request.method == "POST":
        user = User.objects.get(id=id)
        user.image.delete()
        user.delete()
        messages.success(request, 'User Record Deleted Successfully!')
        return redirect('allusers')
    else:
        messages.error(request, 'Failed to Delete!')
        return redirect('allusers')




   



    



