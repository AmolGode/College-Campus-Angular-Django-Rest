# Generated by Django 4.0.3 on 2022-04-03 13:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_api', '0003_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='usermodel',
            old_name='password',
            new_name='user_password',
        ),
    ]