from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

USER_TYPE = [
    ('user', "User"),
    ('engineer', "Engineer"),
    ('government', "Government"),
    ('admin', "Admin"),
]

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
    image = models.ImageField(upload_to='user_images', blank=True)

    USERNAME_FIELD='email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.full_name+' - '+self.email
    
    def get_full_name(self):
        return self.full_name

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
    def is_user(self):
        if self.user_type == 'user':
            return True

    @property
    def is_active(self):
        return self.active
