from django.contrib import admin

from main.models import Datafile, Dataset, Prediction

# Register your models here.
admin.site.register(Datafile)
admin.site.register(Prediction)
admin.site.register(Dataset)
