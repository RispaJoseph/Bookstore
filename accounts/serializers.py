from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import OTP
from django.core.validators import RegexValidator


User = get_user_model()


mobile_validator = RegexValidator(regex=r"^\d{10,15}$", message="Enter a valid mobile number (10-15 digits)")


class RequestOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    mobile = serializers.CharField(required=False, validators=[mobile_validator])


    def validate(self, attrs):
        email = attrs.get("email")
        mobile = attrs.get("mobile")
        if not email and not mobile:
            raise serializers.ValidationError("Provide either email or mobile")
        if email and mobile:
            raise serializers.ValidationError("Provide only one of email or mobile")
        return attrs


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    mobile = serializers.CharField(required=False, validators=[mobile_validator])
    otp = serializers.RegexField(regex=r"^\d{6}$", required=True)


    def validate(self, attrs):
        email = attrs.get("email")
        mobile = attrs.get("mobile")
        if not email and not mobile:
            raise serializers.ValidationError("Provide either email or mobile")
        if email and mobile:
            raise serializers.ValidationError("Provide only one of email or mobile")
        return attrs