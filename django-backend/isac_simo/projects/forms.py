from django import forms
from django.db import models
from django.forms.widgets import Textarea

from main.models import User

from .models import Projects
from isac_simo.classifier_list import detect_object_model_id


class ProjectForm(forms.ModelForm):
    class Meta:
        model = Projects     
        fields = ('project_name', 'project_desc', 'detect_model', 'image')
        labels = {
            'project_name': 'Project Name',
            'project_desc': 'Description',
            'image': "Project Image",
            'detect_model': "Object Detect Model",
        }
        widgets = {
          'project_desc': Textarea(attrs={'rows':4, 'cols':20}),
          'detect_model': Textarea(attrs={'rows':1, 'cols':20, 'placeholder':'Default: '+detect_object_model_id}),
        }

    def __init__(self, *args, **kwargs):
        super(ProjectForm, self).__init__(*args, **kwargs)
        self.fields['detect_model'].help_text = 'Make sure the Objects for this model are created <a href="/app/watson/object/list">Here</a><br/>And add required Classifiers for those model <a href="/app/watson/classifier/create">Here</a>'
