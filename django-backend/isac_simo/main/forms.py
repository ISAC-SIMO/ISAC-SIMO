from django import forms
from .models import User
from django.contrib.auth.forms import UserCreationForm
from django.db import models

class LoginForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    class Meta:
        model = User     
        fields = ('email', 'password')
        labels = {
            'email': 'Email',
            'password': 'Password',
        }


    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        #self.fields['position'].empty_label = "Select Position"
        #self.fields['emp_code'].required = False
        # self.fields['image'].required = False


class RegisterForm(UserCreationForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ('email', 'full_name', 'image', 'password1', 'password2')
        labels = {
            'email': 'Email',
            'full_name': 'Full Name',
            'image': 'Profile Picture',
            'password1': 'Password',
            'password2': 'Confirm Password'
        }

    def __init__(self, *args, **kwargs):
        super(RegisterForm, self).__init__(*args, **kwargs)
        #self.fields['position'].empty_label = "Select Position"
        self.fields['image'].required = False
        # self.fields['image'].required = False


class AdminRegisterForm(UserCreationForm):
    email = forms.EmailField()

    USER_TYPE=[('user','User'), ('engineer','Engineer'), ('admin','Admin')]
    user_type = forms.ChoiceField(choices=USER_TYPE, widget=forms.Select, initial = 'user')

    class Meta:
        model = User
        fields = ('email', 'full_name', 'image', 'password1', 'password2', 'user_type')
        labels = {
            'email': 'Email',
            'full_name': 'Full Name',
            'image': 'Profile Picture',
            'password1': 'Password',
            'password2': 'Confirm Password',
            'user_type': 'User Type'
        }

    def __init__(self, *args, **kwargs):
        super(AdminRegisterForm, self).__init__(*args, **kwargs)
        self.fields['image'].required = False


class AdminEditForm(UserCreationForm):
    email = forms.EmailField()

    USER_TYPE=[('user','User'), ('engineer','Engineer'), ('admin','Admin')]
    user_type = forms.ChoiceField(choices=USER_TYPE, widget=forms.Select, initial = 'False')

    class Meta:
        model = User
        fields = ('email', 'full_name', 'image', 'password1', 'password2', 'user_type')
        labels = {
            'email': 'Email',
            'full_name': 'Full Name',
            'image': 'Profile Picture',
            'password1': 'Password',
            'password2': 'Confirm Password',
            'user_type': 'User Type'
        }

    def __init__(self, *args, **kwargs):
        super(AdminEditForm, self).__init__(*args, **kwargs)
        self.fields['image'].required = False
        self.fields['password1'].required = False
        self.fields['password2'].required = False