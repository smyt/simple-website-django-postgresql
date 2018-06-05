from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class VacanciesConfig(AppConfig):
    name = 'vacancies'
    verbose_name = _('Vacancies')
