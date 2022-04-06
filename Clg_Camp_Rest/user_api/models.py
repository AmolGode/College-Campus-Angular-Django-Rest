from django.db import models

# Create your models here.

class UserModel(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    gender = models.CharField(max_length=6)
    college_name = models.CharField(max_length=50)
    user_id = models.CharField(max_length=30,unique = True)
    user_password = models.CharField(max_length=20)
    profile_pic = models.ImageField(blank=True, null=True, upload_to='profile_pic/')

    class Meta:
        db_table = 'user'

