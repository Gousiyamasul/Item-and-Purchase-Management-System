from django.urls import path
from rest_framework.routers import DefaultRouter

from application.views import ItemTypeViewSet, ItemViewSet, PurchaseViewSet, DashboardView

router = DefaultRouter()

router.register("item-types", ItemTypeViewSet)
router.register("items", ItemViewSet)
router.register("purchases", PurchaseViewSet)

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
] + router.urls