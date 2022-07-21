from main.models import Datafile
import os
from django.core.files.uploadedfile import InMemoryUploadedFile


ALLOWED_TEXTURE_EXT = [
    ".jpg", ".jpeg", ".png", ".bmp"
]

FILE_TYPE = {
    ".mtl" : Datafile.Type.MTL,
    ".obj": Datafile.Type.OBJ
}

for ext in ALLOWED_TEXTURE_EXT:
    FILE_TYPE.update({ext : Datafile.Type.TEXTURE})

def validate_request_files(files:list[InMemoryUploadedFile])->bool:
    valid = {
        Datafile.Type.MTL: False,
        Datafile.Type.OBJ: False,
        Datafile.Type.TEXTURE: False,
    }
    for file in files:
        file_ext = os.path.splitext(file.name)[-1]
        if file_ext not in FILE_TYPE.keys():
            return False
        valid[FILE_TYPE[file_ext]] = True

    if not all(valid.values()):
        return False

    return True
