# Generated by Django 4.2.6 on 2023-10-29 14:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('newcomment', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='newcomment',
            name='book_id',
        ),
    ]
