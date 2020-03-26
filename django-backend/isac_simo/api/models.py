from django.db import models
from main.models import User
import uuid
import os
from django.conf import settings
from django.utils.deconstruct import deconstructible
from django.core.validators import MaxValueValidator, MinValueValidator

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
    lat = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)],max_length=100,null=True,blank=True)
    lng = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)],max_length=100,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ImageFile(models.Model):
    image = models.ForeignKey(Image, related_name='image_files', on_delete=models.CASCADE)
    file = models.ImageField(upload_to=path_and_rename)
    tested = models.BooleanField(default=False)
    result = models.CharField(blank=True, null=True, max_length=500)
    score = models.FloatField(validators=[MinValueValidator(-1), MaxValueValidator(1)],max_length=10,null=True,blank=True)
    object_type = models.CharField(blank=True, null=True, max_length=500)
    retrained = models.BooleanField(default=False)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.file.url