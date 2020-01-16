from django.db import models
from main.models import User
import uuid

def images_directory_path(instance, filename):
    return '/'.join(['images', str(instance.id), str(uuid.uuid4().hex + ".png")])

class Image(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=500,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user_id = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    image = models.ImageField(upload_to='image')

    def __str__(self):
        return self.title
