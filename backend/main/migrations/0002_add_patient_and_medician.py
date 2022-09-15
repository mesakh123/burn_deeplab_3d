# Generated by Django 4.0.6 on 2022-09-15 16:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Medician',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('age', models.IntegerField(default=0)),
                ('sex', models.CharField(choices=[('f', 'Female'), ('m', 'Male'), ('u', 'Unsure')], max_length=1)),
                ('height', models.FloatField()),
                ('weight', models.FloatField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('medician_id', models.CharField(max_length=250)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('age', models.IntegerField(default=0)),
                ('sex', models.CharField(choices=[('f', 'Female'), ('m', 'Male'), ('u', 'Unsure')], max_length=1)),
                ('height', models.FloatField()),
                ('weight', models.FloatField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('burn_type', models.CharField(choices=[('s', 'Scald'), ('g', 'Grease'), ('n', 'Contact'), ('f', 'Flame'), ('c', 'Chemical'), ('e', 'Electric'), ('o', 'Other')], max_length=250)),
            ],
            options={
                'verbose_name_plural': 'patients',
            },
        ),
        migrations.AddField(
            model_name='dataset',
            name='medician',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='medician_dataset_set', to='main.medician'),
        ),
        migrations.AddField(
            model_name='dataset',
            name='patient',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='patient_dataset_set', to='main.patient'),
        ),
    ]
