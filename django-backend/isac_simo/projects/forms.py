from django import forms
from .models import Projects
from django.db import models
from main.models import User

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Projects     
        fields = ('project_name', 'project_desc', 'image')
        labels = {
            'project_name': 'Project Name',
            'project_desc': 'Description',
            'image': "Project Image",
        }

    def __init__(self, *args, **kwargs):
        super(ProjectForm, self).__init__(*args, **kwargs)
        #self.fields['position'].empty_label = "Select Position"
        #self.fields['emp_code'].required = False
        # self.fields['image'].required = False