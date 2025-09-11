import random
from django.conf import settings
from django.core.mail import send_mail
from twilio.rest import Client
import logging
logger = logging.getLogger(__name__)

def generate_otp():
    """Generate a 6-digit OTP"""
    return str(random.randint(100000, 999999))

def send_otp_email(email, otp):
    try:
        send_mail(
            subject="Your OTP Code",
            message=f"Your OTP is {otp}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        logger.info(f"OTP sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP to {email}: {e}")
        return False


def normalize_phone(phone: str) -> str:
    return phone.replace(" ", "").replace("-", "")

def send_otp_sms(phone, otp):
    phone = normalize_phone(phone)

    if not all([settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, settings.TWILIO_PHONE_NUMBER]):
        raise ValueError("Twilio settings not configured properly")

    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    message = client.messages.create(
        body=f"Your OTP is {otp}",
        from_=settings.TWILIO_PHONE_NUMBER,
        to=phone
    )
    logger.info(f"OTP SMS sent to {phone}, SID: {message.sid}")
    return message.sid


