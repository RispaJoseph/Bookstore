import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from books.models import Order
from django.conf import settings

from .models import OTP
from .serializers import RequestOTPSerializer, VerifyOTPSerializer
from .utils import send_otp_email, send_otp_sms  # ✅ use helpers

User = get_user_model()


class RequestOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("👉 Incoming payload:", request.data)
        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get("email")
        mobile = serializer.validated_data.get("mobile")

        # Generate 6-digit OTP
        code = f"{random.randint(0, 999999):06d}"

        # Save in DB
        otp = OTP.objects.create(email=email, mobile=mobile, code=code)

        # Decide where to send
        try:
            if email:
                send_otp_email(email, code)
                target = email
            elif mobile:
                send_otp_sms(mobile, code)
                target = mobile
            else:
                return Response(
                    {"detail": "Either email or mobile is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {"message": "OTP sent successfully", "target": target},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"detail": f"Error sending OTP: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get("email")
        mobile = serializer.validated_data.get("mobile")
        otp_code = serializer.validated_data["otp"]

        # Filter OTP
        qs = OTP.objects.filter(code=otp_code, is_used=False)
        if email:
            qs = qs.filter(email=email)
        if mobile:
            qs = qs.filter(mobile=mobile)

        otp = qs.order_by("-created_at").first()
        if not otp or not otp.is_valid():
            return Response(
                {"detail": "Invalid or expired OTP"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Mark OTP as used
        otp.is_used = True
        otp.save(update_fields=["is_used"])

        # Get or create user
        username = email or mobile
        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email or ""},
        )

        if email and not user.email:
            user.email = email
            user.save(update_fields=["email"])

        # Issue JWT tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return Response(
            {
                "access": str(access),
                "refresh": str(refresh),
                "expires_in": access.lifetime.total_seconds(),
            },
            status=status.HTTP_200_OK,
        )


class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by("-created_at")

        data = []
        for o in orders:
            data.append({
                "id": o.id,
                "book": {
                    "id": o.book.id,
                    "title": o.book.title,
                    "author": o.book.author,
                    "price": o.book.price,
                },
                "amount": o.amount,
                "status": o.status,
                "razorpay_order_id": o.razorpay_order_id,
                "razorpay_payment_id": o.razorpay_payment_id,
                "created_at": o.created_at,
            })

        return Response(data, status=status.HTTP_200_OK)
