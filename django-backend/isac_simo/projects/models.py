from django.db import models
from main.models import User

# Create your models here.
class Projects(models.Model):
    project_name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='project_images')
    project_desc = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.project_name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Call the "real" save() method.
