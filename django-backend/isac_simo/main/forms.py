from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.db import models
from django.forms.widgets import FileInput

from .models import USER_TYPE, User


class LoginForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    email = forms.EmailField(error_messages={'unique': 'Email and Password did not match'})
    class Meta:
        model = User     
        fields = ('email', 'password')
        labels = {
            'email': 'Email',
            'password': 'Password',
        }

    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)

class RegisterForm(UserCreationForm):
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ('email', 'full_name', 'image',)
        labels = {
            'email': 'Email',
            'full_name': 'Full Name',
            'image': 'Profile Picture',
        }

    def __init__(self, *args, **kwargs):
        super(RegisterForm, self).__init__(*args, **kwargs)
        self.fields['image'].required = False


class AdminRegisterForm(UserCreationForm):
    email = forms.EmailField()

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
        self.fields['user_type'].help_text = 'Choose User Type Wisely'


class AdminEditForm(UserCreationForm):
    email = forms.EmailField()

    user_type = forms.ChoiceField(choices=USER_TYPE, widget=forms.Select, initial = 'False')

    class Meta:
        model = User
        fields = ('email', 'full_name', 'image', 'password1', 'password2', 'user_type','active')
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
        self.fields['user_type'].help_text = 'Choose User Type Wisely'

class ProfileForm(UserCreationForm):
    email = forms.EmailField()
    image = forms.ImageField(label='Profile Image',required=False,
                            error_messages ={'invalid':"Image files only"},
                            widget=FileInput)
    class Meta:
        model = User
        fields = ('email', 'full_name', 'image', 'password1', 'password2')
        labels = {
            'email': 'Email',
            'full_name': 'Full Name',
            'password1': 'Password',
            'password2': 'Confirm Password',
        }

    def __init__(self, *args, **kwargs):
        super(ProfileForm, self).__init__(*args, **kwargs)
        self.fields['image'].required = False
        self.fields['image'].widget.attrs['accept'] = 'image/x-png,image/gif,image/jpeg'
        self.fields['image'].widget.attrs['onchange'] = 'showBlobImage(event)'
        self.fields['full_name'].required = True
        self.fields['password1'].required = False
        self.fields['password1'].help_text = ''
        self.fields['password1'].widget.attrs['placeholder'] = '*****'
        self.fields['password2'].required = False
        self.fields['password2'].help_text = 'Keep Password blank to not change it.'
        self.fields['password2'].widget.attrs['placeholder'] = '*****'
