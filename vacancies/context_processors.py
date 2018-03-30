from django.conf import settings

from vacancies.serializers import ResumePagesSerializer


def resume_serializer(request):
    serializer = ResumePagesSerializer(style={
        'fields': {
            ''
        },
        'id': 'profile-message-m'
    })
    return {'resume_serializer': serializer}


def google_api_captcha_key(request):
    return {'google_captcha_key': settings.GR_CAPTCHA_SITE_KEY}
