"""Public useful utils."""
import requests

from constance import config
from django.conf import settings
from django.core.mail import EmailMessage


def send_serializer_mail(serializer, subject=None):
    """E-mail's sender.

    param serializer: serializer with data
    param subject: subject email
    """
    email_recipients = config.EMAIL_ADDRESSES.split(',')
    if email_recipients:
        subject = subject or settings.EMAIL_SUBJECT
        email_from = settings.DEFAULT_FROM_EMAIL
        validated_data = serializer.validated_data
        message = '\n'.join([field.label + ': ' + validated_data.get(field_name, '')
                             for field_name, field in serializer.fields.items()
                             if type(field_name) == str and field_name not in ('captcha', 'file',)])

        email = EmailMessage(
            subject,
            message,
            from_email=email_from,
            to=email_recipients,
        )

        if 'file' in validated_data:
            file = validated_data['file']
            email.attach(file.name, file.read())

        email.send(fail_silently=not settings.DEBUG)


def check_captcha(captcha_response):
    """Google captcha checker.

    return True or False
    """
    if captcha_response:
        response = requests.post(settings.GR_CAPTCHA_URL, data={
            'secret': settings.GR_CAPTCHA_SECRET_KEY,
            'response': captcha_response
        })
        is_success = response.json().get('success', False)
        if is_success:
            return True
    return False
