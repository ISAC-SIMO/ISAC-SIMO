from django import forms
from django.db import models

from .models import Image


class ImageForm(forms.ModelForm):
    image = forms.ImageField(widget=forms.ClearableFileInput(attrs={'multiple': True}), required=False)
    class Meta:
        model = Image     
        fields = ('title', 'description', 'user', 'lat', 'lng', 'image')
        labels = {
            'user':'User',
            'lat':'Latitude',
            'lng':'Longitude'
        }

    def __init__(self, *args, **kwargs):
        super(ImageForm, self).__init__(*args, **kwargs)
        self.fields['user'].empty_label = "-- Keep Unselected for Setting to Yourself --"
        self.fields['image'].label = "Multiple Images"
        self.fields['lat'].widget.attrs['min'] = -90
        self.fields['lat'].widget.attrs['max'] = 90
        self.fields['lng'].widget.attrs['min'] = -180
        self.fields['lng'].widget.attrs['max'] = 180
