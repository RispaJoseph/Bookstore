from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.core.validators import RegexValidator
from django.conf import settings


User = get_user_model()


mobile_validator = RegexValidator(
    regex=r"^\d{10,15}$",
    message="Enter a valid mobile number (10-15 digits)",
)


class OTP(models.Model):
    email = models.EmailField(null=True, blank=True, db_index=True)
    mobile = models.CharField(max_length=15, null=True, blank=True, validators=[mobile_validator], db_index=True)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)


    def save(self, *args, **kwargs):
        if not self.expires_at:
            from django.conf import settings
            minutes = getattr(settings, "OTP_EXPIRY_MINUTES", 5)
            self.expires_at = timezone.now() + timedelta(minutes=minutes)
        super().save(*args, **kwargs)


    def is_valid(self):
        return (not self.is_used) and timezone.now() <= self.expires_at


    def __str__(self):
        target = self.email or self.mobile or "unknown"
        return f"OTP({target}) {self.code}"