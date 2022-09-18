
from django.db import models
import os

def save_dataset_files(instance, filename):
    return os.path.join("media","documents",instance.dataset.dataset_uuid,"ground_truth",filename)

def save_predict_files(instance, filename):
    return os.path.join("media","documents",instance.dataset.dataset_uuid,"predictions",filename)


class AbstractData(models.Model):
    name = models.CharField(max_length=100,blank=True,null=True)
    description = models.TextField(default="",blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class AbstractPatient(models.Model):
    class SexChoice(models.TextChoices):
        FEMALE = 'f', 'Female'
        MALE = 'm', 'Male'
        UNSURE = 'u', 'Unsure'

    name = models.CharField(max_length=200,default="",blank=True,null=True)
    age = models.IntegerField(default=0)
    sex = models.CharField(max_length=1,choices=SexChoice.choices)
    height = models.FloatField(default=0,null=True,blank=True)
    weight = models.FloatField(default=0,null=True,blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class Medician(AbstractPatient):
    PREFETCH_RELATED_FIELDS = ["medician_case_set"]
    medician_id =  models.CharField(max_length=250)

class Patient(AbstractPatient):
    PREFETCH_RELATED_FIELDS = ["patient_dataset_set"]
    patient_id = models.CharField(max_length=250,null=True,blank=True,default="")
    class Meta:
            verbose_name_plural ="patients"

class DataInfo(models.Model):
    SELECT_RELATED_FIELDS = ["medician","patient"]
    PREFETCH_RELATED_FIELDS = ["dataset_set"]
    class BurnChoice(models.TextChoices):
            SCALD = ('s','Scald')
            GREASE = ('g','Grease')
            CONTACT = ('n','Contact')
            FLAME = ('f','Flame')
            CHEMICAL = ('c','Chemical')
            ELECTRIC = ('e','Electric')
            OTHER = ('o','Other')
    patient = models.ForeignKey(Patient, null=True, on_delete=models.SET_NULL,related_name='patient_case_set')
    medician = models.ForeignKey(Medician, null=True, on_delete=models.SET_NULL,related_name='medician_case_set')
    burn_type =  models.CharField(max_length=250,choices=BurnChoice.choices)
    comments = models.TextField(max_length=1000,null=True,blank=True)

    created = models.DateTimeField(auto_now_add=True)


class OperationStatus(models.TextChoices):
    EMPTY = "empty","Empty"
    READY = "ready", "Ready"
    FAILED = "failed", "Failed"
    PROCESSING = "processing", "Processing"
    COMPLETED = "completed", "Completed"


class Dataset(AbstractData):
    PREFETCH_RELATED_FIELDS = ["prediction_set", "file_set"]
    SELECT_RELATED_FIELDS = ["data_info"]
    dataset_uuid = models.CharField(max_length=100,null=True,blank=True)
    upload_status = models.CharField(
        max_length=15,
        default=OperationStatus.PROCESSING,
        choices=OperationStatus.choices,
    )

    data_info = models.ForeignKey(DataInfo, null=True, on_delete=models.SET_NULL,related_name='dataset_set')

class Prediction(AbstractData):
    dataset = models.ForeignKey(Dataset, related_name="prediction_set",null=True,on_delete=models.SET_NULL)
    file = models.FileField(null=True, upload_to=save_predict_files)
    predict_status = models.CharField(
        max_length=15,
        default=OperationStatus.PROCESSING,
        choices=OperationStatus.choices,
    )


class Datafile(AbstractData):
    class Type(models.TextChoices):
        TEXTURE = "texture","Texture"
        OBJ = "obj", "Obj"
        MTL= "mtl", "Mtl"

    dataset = models.ForeignKey(Dataset, related_name="file_set",null=True, on_delete=models.SET_NULL)
    file = models.FileField(null=True, upload_to=save_dataset_files)
    type = models.CharField(
        max_length=15,
        default=Type.TEXTURE,
        choices=Type.choices,
    )
