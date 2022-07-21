"""
[ActionBasedSerializerClassMixin] divides the serializer class by actions.
You can specify serializer_class each action now by overriding related serializer class.
It will use the original serializer_class if there is no separated serializer class by default.

[Scene 1] using DatasetListSerializer for GET /api/datasets/
list_serializer_class = DatasetListSerializer

[Scene 2] using DatasetDetailSerializer for GET /api/datasets/{id}/
retrieve_serializer_class = DatasetDetailSerializer
"""

from typing import Optional

from rest_framework.serializers import Serializer


class ActionBasedSerializerClassMixin:
    base_serializer_class: Optional[type[Serializer]] = None
    list_serializer_class: Optional[type[Serializer]] = None
    create_serializer_class: Optional[type[Serializer]] = None
    retrieve_serializer_class: Optional[type[Serializer]] = None
    update_serializer_class: Optional[type[Serializer]] = None
    partial_update_serializer_class: Optional[type[Serializer]] = None
    destroy_serializer_class: Optional[type[Serializer]] = None

    def get_serializer_class(self):
        action_serializer_class_map = {
            "list": self.list_serializer_class,
            "create": self.create_serializer_class,
            "retrieve": self.retrieve_serializer_class,
            "update": self.update_serializer_class,
            "partial_update": self.partial_update_serializer_class,
            "destroy": self.destroy_serializer_class,
        }
        return (
            action_serializer_class_map.get(self.action) or self.base_serializer_class
        )
