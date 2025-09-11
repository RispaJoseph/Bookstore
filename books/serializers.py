from rest_framework import serializers
from .models import Book
from .models import Order

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "author", "published_year", "price", "created_at", "updated_at"]

class OrderSerializer(serializers.ModelSerializer):
    book = BookSerializer()  

    class Meta:
        model = Order
        fields = "__all__"