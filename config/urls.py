from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # Authentication endpoints
    path("auth/", include("accounts.urls")),

    # Books endpoints
    path("books/", include("books.urls")),
]
