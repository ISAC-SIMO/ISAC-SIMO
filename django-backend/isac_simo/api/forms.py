from django import forms
from django.db import models

from .models import Image
from django.forms.widgets import Textarea
from projects.models import Projects
from api.models import OfflineModel


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


class OfflineModelForm(forms.ModelForm):
    model_type = forms.ChoiceField(choices=[('OBJECT_DETECT','Object Detect'),('CLASSIFIER','Classifier')], widget=forms.Select, initial = 'model_type')
    model_format = forms.CharField(widget=forms.Select, initial = 'model_format')
    class Meta:
        model = OfflineModel     
        fields = ('name', 'model_type', 'model_format', 'file')
        labels = {
            'model_type':'Model Type',
            'model_format':'Model File Format',
            'file':'File',
        }

    def __init__(self, *args, **kwargs):
        super(OfflineModelForm, self).__init__(*args, **kwargs)
        self.fields['model_format'].help_text = 'Choose a format or type yourself'
        if self.instance and False: # TODO: self.instance.projects and self.instance.classifiers exists then hide format in edit
            self.fields['model_type'].widget = forms.HiddenInput()
            self.fields['model_format'].help_text = 'Choose a format or type yourself <br/> Model Type is Unable to change because it is used by some projects'