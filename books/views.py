from rest_framework import viewsets, permissions, filters
from rest_framework.permissions import SAFE_METHODS
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Book
from .serializers import BookSerializer

class ReadOnlyOrAuth(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

class DefaultPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "limit"

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by("-id")
    serializer_class = BookSerializer
    permission_classes = [ReadOnlyOrAuth]
    pagination_class = DefaultPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["author", "published_year"]
    search_fields = ["title", "author"]
    ordering_fields = ["id", "published_year", "price", "title"]
