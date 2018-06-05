from django.utils.translation import gettext as _

REQUIRED_ERROR_TEXT = _('This field is required')
FIO_ERROR_TEXT = _('Input correct data')
FIO_ERRORS_MESSAGES = {
    'required': REQUIRED_ERROR_TEXT,
    'invalid': FIO_ERROR_TEXT,
    'min_length': FIO_ERROR_TEXT,
    'max_length': FIO_ERROR_TEXT
}

SKYPE_ERROR_TEXT = _('Input correct skype login')
SKYPE_ERRORS_MESSAGES = {
    'required': REQUIRED_ERROR_TEXT,
    'invalid': SKYPE_ERROR_TEXT,
    'min_length': SKYPE_ERROR_TEXT,
    'max_length': SKYPE_ERROR_TEXT
}

PHONE_ERROR_TEXT = _('Input correct phone number')
PHONE_ERRORS_MESSAGES = {
    'required': REQUIRED_ERROR_TEXT,
    'invalid': PHONE_ERROR_TEXT,
    'min_length': PHONE_ERROR_TEXT,
    'max_length': PHONE_ERROR_TEXT
}

EMAIL_ERRORS_MESSAGES = {
    'required': REQUIRED_ERROR_TEXT,
    'invalid': _('Wrong e-mail format, Make sure it matches xxxxx@xxxxx.xxx')
}

CAPTCHA_ERROR_TEXT = _('Captcha error text')

FORM_SUCCESS_TEXT = _('Form sent successfully. Please, wait for an answer soon.')
COMPLAINT_FORM_SUCCESS_TEXT = _('Your claim was successfully sent to the email of the company Director. '
                                'We will take action as soon as possible. Thank you for contacting us!')

FILE_ERROR_TEXT = _('Wrong type file')
UPLOADED_FILE_ERROR_TEXT = _('Max uploaded file size is 5Mb')
