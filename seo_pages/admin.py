from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from seo_pages.consts import VACANCY_TITLE, COUNTRY_NAME, CITY_NAME
from .models import SeoPage


class SeoPageAdmin(admin.ModelAdmin):
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        message = '{} {} - {}, {} | SMYT'.format(_('Vacancy'), VACANCY_TITLE, CITY_NAME, COUNTRY_NAME)
        form.base_fields['title'].initial = message
        return form

admin.site.register(SeoPage, SeoPageAdmin)
