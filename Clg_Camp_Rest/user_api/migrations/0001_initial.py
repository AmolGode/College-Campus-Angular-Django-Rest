# Generated by Django 4.0.3 on 2022-04-03 12:16

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=20)),
                ('last_name', models.CharField(max_length=20)),
                ('gender', models.CharField(max_length=6)),
                ('college_name', models.CharField(max_length=50)),
                ('user_id', models.CharField(max_length=30)),
                ('password', models.CharField(max_length=20)),
            ],
        ),
    ]
