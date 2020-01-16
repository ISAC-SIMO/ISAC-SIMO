from django import forms
from .models import User, USER_TYPE
from django.contrib.auth.forms import UserCreationForm
from django.db import models

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
        self.fields['user_type'].help_text = 'Choose User Type Wisely'