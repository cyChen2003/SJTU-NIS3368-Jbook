# Generated by Django 4.2.6 on 2023-10-29 14:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newcomment', '0002_remove_newcomment_book_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='newcomment',
            name='book_id',
            field=models.IntegerField(null=True),
        ),
    ]
