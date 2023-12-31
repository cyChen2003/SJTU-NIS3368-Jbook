# Generated by Django 4.2.6 on 2023-10-22 12:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bookname', models.CharField(default='', max_length=100)),
                ('publisher', models.CharField(default='', max_length=100)),
                ('author', models.CharField(default='', max_length=100)),
                ('comment', models.CharField(default='', max_length=500)),
                ('rate', models.FloatField(default=0, max_length=5)),
                ('tag', models.CharField(default=None, max_length=50)),
                ('image', models.CharField(default=None, max_length=100)),
            ],
        ),
    ]
