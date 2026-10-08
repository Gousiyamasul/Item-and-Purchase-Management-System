from django.shortcuts import render
from rest_framework import mixins, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from application.models import Item_Types, Items, Purchase, Purchase_Items
from application.serializers import ItemTypeSerializer, ItemSerializer, PurchaseSerializer, PurchaseItemSerializer

class ItemTypeViewSet(mixins.ListModelMixin,
                      mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      viewsets.GenericViewSet):
    queryset = Item_Types.objects.all().order_by("id")
    serializer_class = ItemTypeSerializer

    def destroy(self, request, pk=None):
        item_type = self.get_object()
        if Items.objects.filter(item_type=item_type).exists():
            return Response(
                {"error": "This item type is used by items and cannot be deleted."},
                status=status.HTTP_409_CONFLICT,
            )
        item_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ItemViewSet(mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  viewsets.GenericViewSet):

    queryset = Items.objects.select_related("item_type").order_by("id")
    serializer_class = ItemSerializer

    def destroy(self, request, pk=None):
        item = self.get_object()

        if Purchase_Items.objects.filter(item=item).exists():
            return Response(
                    {"error": "This item has purchase history and cannot be deleted. Please deactivate it instead."},
                    status=status.HTTP_409_CONFLICT,
                )
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PurchaseViewSet(mixins.ListModelMixin,
                      mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      viewsets.GenericViewSet):
    queryset = Purchase.objects.prefetch_related("purchase_items__item__item_type").order_by("-id")
    serializer_class = PurchaseSerializer

    def destroy(self, request, pk=None):
        return Response(
            {"error": "Purchases cannot be deleted. They are historical records."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )
    
class DashboardView(APIView):
    def get(self, request):
        data = {
            "total_items": Items.objects.count(),
            "active_items": Items.objects.filter(active=True).count(),
            "total_purchases": Purchase.objects.count(),
            "out_of_stock_items": Items.objects.filter(stock_available=0).count(),
        }
        return Response(data)