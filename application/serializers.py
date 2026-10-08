from rest_framework import serializers
from django.db import transaction
from application.models import Item_Types, Items, Purchase, Purchase_Items

class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item_Types
        fields = "__all__"

class ItemSerializer(serializers.ModelSerializer):

    item_type_name = serializers.SerializerMethodField()
    availability = serializers.SerializerMethodField()

    class Meta:
        model = Items
        fields = "__all__"

    def get_item_type_name(self, obj):
        return obj.item_type.item_type_name

    def get_availability(self, obj):
        return "Available" if obj.stock_available > 0 else "Out of Stock"

    def validate_item_name(self, value):
        if value.strip() == "":
            raise serializers.ValidationError("Item name is required")
        return value

class PurchaseItemSerializer(serializers.ModelSerializer):
    item_name = serializers.SerializerMethodField()
    item_type_name = serializers.SerializerMethodField()
    current_stock = serializers.SerializerMethodField()

    class Meta:
        model = Purchase_Items
        fields = [
            "id",
            "purchase",
            "item",
            "quantity",
            "created_at",
            "item_name",
            "item_type_name",
            "current_stock",
        ]
        read_only_fields = ["purchase"]

    def get_item_name(self, obj):
        return obj.item.item_name

    def get_item_type_name(self, obj):
        return obj.item.item_type.item_type_name

    def get_current_stock(self, obj):
        return obj.item.stock_available

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than zero"
            )
        return value

class PurchaseSerializer(serializers.ModelSerializer):

    items = PurchaseItemSerializer(many=True, source="purchase_items")
     
    class Meta:
        model = Purchase
        fields = ["order", "purchase_date", "items"]

    def validate_items(self, items):
        if len(items) == 0:
            raise serializers.ValidationError(
                "Purchase must contain at least one item"
            )

        used = []

        for row in items:
            item = row["item"]
            quantity = row["quantity"]

            if item.id in used:
                raise serializers.ValidationError(
                    item.item_name + " is added more than once"
                )

            if quantity > item.stock_available:
                raise serializers.ValidationError(
                    f"Only {item.stock_available} units of "
                    f"{item.item_name} are available. "
                    f"You requested {quantity}."
                )

            used.append(item.id)

        return items

    def create(self, validated_data):

        items_data = validated_data.pop("purchase_items")

        with transaction.atomic():
            purchase = Purchase.objects.create(**validated_data)

            for item_data in items_data:
                item = item_data["item"]
                quantity = item_data["quantity"]

                Purchase_Items.objects.create(
                    purchase=purchase,
                    **item_data
                )

                item.stock_available -= quantity
                item.save()

        return purchase
