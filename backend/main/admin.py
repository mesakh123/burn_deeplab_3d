from django.contrib import admin

from main.models import DataInfo, Datafile, Dataset, Prediction, Patient,Medician

# Register your models here.
admin.site.register(Datafile)
admin.site.register(Prediction)
admin.site.register(Dataset)
admin.site.register(Patient)
admin.site.register(Medician)
admin.site.register(DataInfo)
