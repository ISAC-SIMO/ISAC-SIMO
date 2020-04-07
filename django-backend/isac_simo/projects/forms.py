from django import forms
from django.db import models
from django.forms.widgets import Textarea

from main.models import User

from .models import Projects


class ProjectForm(forms.ModelForm):
    class Meta:
        model = Projects     
        fields = ('project_name', 'project_desc', 'image')
        labels = {
            'project_name': 'Project Name',
            'project_desc': 'Description',
            'image': "Project Image",
        }
        widgets = {
          'project_desc': Textarea(attrs={'rows':4, 'cols':20}),
        }

    def __init__(self, *args, **kwargs):
        super(ProjectForm, self).__init__(*args, **kwargs)
