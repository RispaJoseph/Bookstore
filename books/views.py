from rest_framework import viewsets, permissions, filters, status
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from django.shortcuts import get_object_or_404
import razorpay

from .models import Book, Order
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

    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def create_order(self, request, pk=None):
        """Create Razorpay order for this book"""
        book = self.get_object()
        amount = int(book.price * 100)  

        try:
            razor_order = self.client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": 1,
            })
        except razorpay.errors.AuthenticationError:
            return Response(
                {"detail": "Invalid Razorpay API credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except razorpay.errors.BadRequestError as e:
            return Response(
                {"detail": f"Invalid order request: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except razorpay.errors.ServerError:
            return Response(
                {"detail": "Payment gateway error. Please try again later."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except Exception as e:
            return Response(
                {"detail": f"Unexpected error while creating order: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Save order in DB
        order = Order.objects.create(
            user=request.user,
            book=book,
            razorpay_order_id=razor_order.get("id"),
            amount=amount,
            status="created"
        )

        return Response(
            {
                "order_id": razor_order.get("id"),
                "amount": amount,
                "display_amount": book.price,
                "currency": "INR",
                "key": settings.RAZORPAY_KEY_ID,
                "book": {
                    "id": book.id,
                    "title": book.title,
                    "author": book.author,
                    "price": book.price
                },
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def verify_payment(self, request):
        """Verify Razorpay payment after checkout"""
        data = request.data
        params = {
            "razorpay_order_id": data.get("razorpay_order_id"),
            "razorpay_payment_id": data.get("razorpay_payment_id"),
            "razorpay_signature": data.get("razorpay_signature"),
        }

        if not all(params.values()):
            return Response(
                {"detail": "Missing payment verification parameters"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            self.client.utility.verify_payment_signature(params)
        except razorpay.errors.SignatureVerificationError:
            order = Order.objects.filter(razorpay_order_id=params["razorpay_order_id"]).first()
            if order:
                order.status = "failed"
                order.save()
            return Response(
                {"detail": "Signature verification failed"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"detail": f"Unexpected error during verification: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # If verified → update order
        order = get_object_or_404(Order, razorpay_order_id=params["razorpay_order_id"])
        order.razorpay_payment_id = params["razorpay_payment_id"]
        order.razorpay_signature = params["razorpay_signature"]
        order.status = "paid"
        order.save()

        return Response(
            {"detail": "Payment verified successfully", "order_id": order.id},
            status=status.HTTP_200_OK,
        )
