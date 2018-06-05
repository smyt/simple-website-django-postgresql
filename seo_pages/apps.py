from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class SeoPagesConfig(AppConfig):
    name = 'seo_pages'
    verbose_name = _('Seo for site')
