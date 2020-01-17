from django import forms
from django.db import models
from .models import Image

class ImageForm(forms.ModelForm):
    class Meta:
        model = Image     
        fields = ('title', 'description', 'user', 'image')
        labels = {
            'user':'User'
        }

    def __init__(self, *args, **kwargs):
        super(ImageForm, self).__init__(*args, **kwargs)
        self.fields['user'].empty_label = "-- Keep Unselected for Anonymous --"