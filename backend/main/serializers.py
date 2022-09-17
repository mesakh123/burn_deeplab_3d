import os
import uuid
from numpy import require
from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import transaction
from django.conf import settings

from typing import Union,Sequence,Literal

from .models import DataInfo, Datafile, Dataset, Prediction, Patient,Medician
from .utils.validator import validate_request_files,FILE_TYPE


FIELDS = Union[Sequence[str], Literal["__all__"]]
class DatafileSerializer(serializers.ModelSerializer):
    file = serializers.FileField( allow_empty_file=True, allow_null=True)
    class Meta:
        model = Datafile
        fields = "__all__"

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = "__all__"

class PredictionSerializer(serializers.ModelSerializer):
    file = serializers.FileField( allow_empty_file=True, allow_null=True)
    class Meta:
        model = Prediction
        fields = "__all__"

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"

class MedicianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medician
        fields = "__all__"

class DataInfoBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataInfo
        fields = "__all__"


class UploadResponseSerializer(DatasetSerializer):
    gt_files = DatafileSerializer(source="file_set",many=True)
    pt_files = DatafileSerializer(source="prediction_set",many=True)


class UploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields= "__all__"
    files = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False),
        max_length=3,
        write_only=True,
    )
    def create(self, validated_data):
        files = validated_data.get("files",None)
        validated_data.pop("files",None)
        if len(files) < 3 :
            raise ValueError("There must be at least 3 files to created_at")

        if  not validate_request_files(files):
            raise ValueError("There must be an image, an obj file, and a mtl file required")


        validated_data["dataset_uuid"] = str(uuid.uuid4())

        dataset = None
        with transaction.atomic():
            dataset = super().create(validated_data)


        Datafile.objects.bulk_create(
            [
                Datafile(dataset=dataset,file=file,type=FILE_TYPE.get(os.path.splitext(file.name)[-1],Datafile.Type.TEXTURE))
                for file in files
            ]
        )

        return dataset



class DataInfoResponseSerializer(DataInfoBaseSerializer):

    patient = PatientSerializer(read_only=True)
    medician = MedicianSerializer(read_only=True)

class DataInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataInfo
        fields: FIELDS = [
            "id","burn_type","comments",
            "patient_id","medician_id",
            "name","age","height","weight",
            "sex"
        ]

    medician_id = serializers.CharField(max_length=50,required=True,write_only=True)
    patient_id = serializers.CharField(max_length=50,required=True,write_only=True)
    name = serializers.CharField(max_length=50,required=True,write_only=True)
    sex = serializers.CharField(max_length=50,required=True,write_only=True)
    age = serializers.IntegerField(required=True,write_only=True)
    height = serializers.FloatField(required=True,write_only=True)
    weight = serializers.FloatField(required=True,write_only=True)

    def create(self, validated_data)->DataInfo:

        medician_id = validated_data.pop("medician_id",None)
        patient_id = validated_data.pop("patient_id","")
        age = validated_data.pop("age","")
        sex = validated_data.pop("sex","")
        height = validated_data.pop("height","")
        weight = validated_data.pop("weight","")
        name = validated_data.pop("name","")
        with transaction.atomic():
            data_info = super().create(validated_data)
            try:
                patient = Patient.objects.get(patient_id=patient_id)
            except Exception as _:
                patient = Patient.objects.create(
                    patient_id=patient_id,
                    name = name,
                    age = age,
                    sex = sex,
                    height = height,
                    weight = weight,
                )

            medician,_ = Medician.objects.get_or_create(medician_id=medician_id)
            data_info.patient = patient
            data_info.medician = medician
            data_info.save()

        return data_info
