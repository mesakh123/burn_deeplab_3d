
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


class OperationStatus(models.TextChoices):
    EMPTY = "empty","Empty"
    READY = "ready", "Ready"
    FAILED = "failed", "Failed"
    PROCESSING = "processing", "Processing"
    COMPLETED = "completed", "Completed"


class Dataset(AbstractData):
    PREFETCH_RELATED_FIELDS = ["prediction_set", "file_set"]
    dataset_uuid = models.CharField(max_length=100,null=True,blank=True)
    upload_status = models.CharField(
        max_length=15,
        default=OperationStatus.PROCESSING,
        choices=OperationStatus.choices,
    )


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
