from django.core.validators import RegexValidator

from vacancies.messages import SKYPE_ERROR_TEXT

skype_validator = RegexValidator('^[\w\d_\-.:]+$', SKYPE_ERROR_TEXT)

phone_validator = RegexValidator('^[\+|\d][\d\-]+$')
