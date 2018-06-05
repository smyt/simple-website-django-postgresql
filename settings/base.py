import os

from django.utils.translation import gettext_lazy as _

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEBUG = False

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.sitemaps',

    'ckeditor',
    'ckeditor_uploader',
    'smart_selects',
    'constance',
    'constance.backends.database',
    'rest_framework',
    'django_filters',
    'django_rq',
    'compressor',

    'vacancies',
    'questions',
    'seo_pages',
    'users',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
]

ROOT_URLCONF = 'smyt_careers.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'debug': DEBUG,
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'vacancies.context_processors.resume_serializer',
                'vacancies.context_processors.google_api_captcha_key'
            ],
        },
    },
]

WSGI_APPLICATION = 'smyt_careers.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'ru-RU'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, 'static'),
# ]

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'common_static/'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

CKEDITOR_UPLOAD_PATH = "uploads/"

USE_DJANGO_JQUERY = True
JQUERY_URL = False

LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale/'),
)

LANGUAGES = [
    ('ru', _('Russian')),
    ('en', _('English')),
]

CONSTANCE_BACKEND = 'constance.backends.database.DatabaseBackend'

CONSTANCE_CONFIG = {
    'EMAIL_ADDRESSES': ('', 'Список E-mail адресов для получения информации с форм')
}

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissions',
    ],
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',)
}

EMAIL_SUBJECT = 'Сообщение с сайта'
EMAIL_SUBJECT_PREFIX = '[SMYT CAREERS] '

LOG_FILE_PATH = os.path.join(BASE_DIR, 'debug.log')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'filters': ['require_debug_false'],
        },
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'simple'
        },
        'file_handler': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'DEBUG',
            'filename': LOG_FILE_PATH,
            'formatter': 'verbose',
            'maxBytes': 1024 * 1024 * 5,
            'backupCount': 5,
        },
    },
    'loggers': {
        'django': {
            'handlers': ['mail_admins', 'file_handler'],
            'level': 'ERROR',
        },
        'django.request': {
            'handlers': ['console', 'file_handler'],
            'level': 'DEBUG',
        },
        'django.db.backends': {
            'level': 'ERROR',
            'handlers': ['console', 'file_handler'],
        },
        'smyt': {
            'handlers': ['console', 'file_handler'],
            'level': 'INFO',
        },
    },
}

RQ_QUEUES = {
    'default': {
        'URL': 'redis://localhost:6379/0',
        'DEFAULT_TIMEOUT': 360,
    },
}

GR_CAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify"
GR_CAPTCHA_SITE_KEY = ''
GR_CAPTCHA_SECRET_KEY = ''

COMPRESS_OFFLINE = True
COMPRESS_ENABLED = True

FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5Mb
FILE_UPLOAD_HANDLERS = [
    'django.core.files.uploadhandler.MemoryFileUploadHandler',
]

SITE_ID = 1
