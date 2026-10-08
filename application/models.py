from django.db import models

# Create your models here.

class Item_Types(models.Model):
    item_type_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.item_type_name

class Items(models.Model):
    item_name = models.CharField(max_length=255, unique=True)
    purchase_date = models.DateField()
    item_type = models.ForeignKey(Item_Types, on_delete=models.PROTECT)
    stock_available = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.item_name

class Purchase(models.Model):
    order = models.CharField(max_length=50, unique=True)
    purchase_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.order

class Purchase_Items(models.Model):
    purchase = models.ForeignKey(Purchase, on_delete=models.PROTECT, related_name="purchase_items")
    item = models.ForeignKey(Items, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item.item_name} - {self.quantity}"