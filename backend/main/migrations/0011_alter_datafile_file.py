# Generated by Django 4.0.6 on 2022-07-20 14:33

from django.db import migrations, models
import main.models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0010_alter_prediction_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datafile',
            name='file',
            field=models.FileField(null=True, upload_to=main.models.save_dataset_files),
        ),
    ]
