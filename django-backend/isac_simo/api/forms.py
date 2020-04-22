from django import forms
from django.db import models

from .models import Image
from django.forms.widgets import Textarea
from projects.models import Projects


class ImageForm(forms.ModelForm):
    image = forms.ImageField(widget=forms.ClearableFileInput(attrs={'multiple': True}), required=False)
    class Meta:
        model = Image     
        fields = ('title', 'description', #'user', 
                    'lat', 'lng', 'image', 'project')
        labels = {
            # 'user':'User',
            'lat':'Latitude',
            'lng':'Longitude'
        }
        widgets = {
          'description': Textarea(attrs={'rows':4, 'cols':20}),
        }

    def __init__(self, *args, **kwargs):
        super(ImageForm, self).__init__(*args, **kwargs)
        # self.fields['user'].empty_label = "-- Keep Unselected for Setting to Yourself --"
        self.fields['project'].empty_label = "No Project Linked Yet !!"
        if self.instance.user and self.instance.user.is_admin:
            self.fields['project'].queryset  = Projects.objects.all()
        elif self.instance.user:
            self.fields['project'].queryset  = Projects.objects.filter(users__id=self.instance.user.id)
        self.fields['image'].label = "Multiple Images"
        self.fields['lat'].widget.attrs['min'] = -90
        self.fields['lat'].widget.attrs['max'] = 90
        self.fields['lng'].widget.attrs['min'] = -180
        self.fields['lng'].widget.attrs['max'] = 180
