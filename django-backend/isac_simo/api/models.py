from django.db import models
from main.models import User
import uuid
import os
from django.conf import settings
from django.utils.deconstruct import deconstructible

@deconstructible
class PathAndRename(object):
    def __init__(self, sub_path):
        self.path = sub_path

    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        filename = '{}.{}'.format(uuid.uuid4().hex, ext)
        return os.path.join(self.path, filename)

path_and_rename = PathAndRename("image")

class Image(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=500,blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='user')
    image = models.ImageField(upload_to=path_and_rename)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
