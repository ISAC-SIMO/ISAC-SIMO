import os
import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils.deconstruct import deconstructible

from projects.models import Projects

USER_TYPE = [
    ('user', "User"),
    ('engineer', "Engineer"),
    ('government', "Government"),
    ('admin', "Admin"),
]

@deconstructible
class PathAndRename(object):
    def __init__(self, sub_path):
        self.path = sub_path

    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        filename = '{}.{}'.format(uuid.uuid4().hex, ext)
        return os.path.join(self.path, filename)

path_and_rename = PathAndRename("user_images")

class UserManager(BaseUserManager):
    def create_user(self, email,  password=None, user_type='user', is_active=True):
        if not email:
            raise ValueError("Users must have email address")
        if not password:
            raise ValueError("Users must have password")
        else:
            user_obj = self.model(
                email=self.normalize_email(email)
            )
            user_obj.set_password(password) #change password
            user_obj.user_type = user_type
            user_obj.active = is_active
            user_obj.save(using = self._db)
            return user_obj

    def create_staffuser(self, email, password=None):
        staff_user = self.create_user(
            email,
            password = password,
            user_type = 'user'
        )
        return staff_user

    def create_superuser(self, email, password=None):
        super_user = self.create_user(
            email,
            password = password,
            user_type = 'admin'
        )
        return super_user

class User(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    active = models.BooleanField(default=True) #can login
    user_type = models.CharField(max_length=50, choices=USER_TYPE, default='user')
    is_staff = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add = True)
    image = models.ImageField(upload_to=path_and_rename, default='user_images/default.png', blank=True)
    projects = models.ManyToManyField('projects.Projects', blank=True, related_name='users')
    # USER IS LINKED TO PROJECT WITH m2m AND USER CAN UPLOAD IMAGE FOR SPECIFIC PROJECT
    # AND VIEW THE IMAGES EITHER ADDED BY THIS USER -OR- BELONGS TO THIS USERS m2m PROJECTS

    USERNAME_FIELD='email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        str = self.full_name or ''
        if str:
            str = str + ' - '

        str = str + (self.email or '(no email)')
        return str
    
    def get_full_name(self):
        return self.full_name

    def get_project_list(self):
        return "<br/> ".join(list(map(lambda x: '⮞ '+x.project_name, self.projects.all())))
    
    def get_project_json(self):
        projects = []
        for project in self.projects.all():
            projects = projects + [{
                'id': project.id,
                'project_name': project.project_name,
                'project_desc': project.project_desc
            }]
        return projects

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_admin(self):
        if self.user_type == 'admin':
            return True

    @property
    def is_engineer(self):
        if self.user_type == 'engineer':
            return True

    @property
    def is_government(self):
        if self.user_type == 'government':
            return True

    @property
    def is_user(self):
        if self.user_type == 'user':
            return True

    @property
    def is_active(self):
        return self.active
