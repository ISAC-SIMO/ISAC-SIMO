from django import forms
from django.db import models
from django.forms.widgets import Select, Textarea

from api.models import OfflineModel
from isac_simo.classifier_list import detect_object_model_id
from main.models import User

from .models import Projects


class ProjectForm(forms.ModelForm):
    class Meta:
        model = Projects     
        fields = ('project_name', 'project_desc', 'detect_model', 'offline_model', 'image')
        labels = {
            'project_name': 'Project Name',
            'project_desc': 'Description',
            'image': "Project Image",
            'detect_model': "Online Object Detect Model",
            'offline_model': "Offline Object Detect Model",
        }
        widgets = {
          'project_desc': Textarea(attrs={'rows':4, 'cols':20}),
          'detect_model': Textarea(attrs={'rows':1, 'cols':20, 'placeholder':'Default: '+detect_object_model_id}),
          'offline_model': Select(attrs={'placeholder':'Select Offline Model'}),
        }

    def __init__(self, *args, **kwargs):
        super(ProjectForm, self).__init__(*args, **kwargs)
        self.fields['detect_model'].help_text = 'Make sure the Objects for this model are created <a href="/app/watson/object/list">Here</a><br/>And add required Classifiers for those model <a href="/app/watson/classifier/create">Here</a>'
        self.fields['offline_model'].help_text = 'If Offline Model is provided it is given 1st priority. <br/>Add Offline Model <a href="/app/offline_model/create">Here</a>'
        self.fields['offline_model'].queryset = OfflineModel.objects.filter(model_type='OBJECT_DETECT')
        self.fields['offline_model'].empty_label = ''
