# Generated by Django 4.2.6 on 2023-10-19 02:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Books',
            fields=[
                ('name', models.CharField(max_length=64, primary_key=True, serialize=False, unique=True)),
                ('publisher', models.CharField(max_length=128)),
                ('author', models.CharField(max_length=128)),
                ('publish_date', models.DateTimeField(max_length=128)),
                ('time_uploaded', models.DateTimeField(max_length=128)),
                ('rating', models.FloatField()),
                ('comment_count', models.IntegerField()),
            ],
        ),
    ]
