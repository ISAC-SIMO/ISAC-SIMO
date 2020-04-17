from django.db import models

# Create your models here.
class Projects(models.Model):
    project_name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='project_images')
    project_desc = models.TextField()
    detect_model = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.project_name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Call the "real" save() method.
