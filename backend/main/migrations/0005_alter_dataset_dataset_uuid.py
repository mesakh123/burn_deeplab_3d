# Generated by Django 4.0.6 on 2022-07-10 03:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_alter_dataset_dataset_uuid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dataset',
            name='dataset_uuid',
            field=models.CharField(default='59f66d66-b16a-4073-a6a0-5693039420c0', max_length=100),
        ),
    ]
