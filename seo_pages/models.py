from django.db import models
from django.utils.translation import gettext_lazy as _

from .consts import MAIN_PAGE, VACANCY_LIST, VACANCY_PAGE, QUESTION_LIST


class SeoPage(models.Model):
    choices = (
        (MAIN_PAGE, _('Site main page')),
        (VACANCY_LIST, _('Site page with vacancy list')),
        (VACANCY_PAGE, _('Site page with vacancy page')),
        (QUESTION_LIST, _('Site page with question list')),
    )
    type_page = models.CharField(_('Type page'), choices=choices, max_length=255, unique=True)
    title = models.CharField(_('Title page'), max_length=255)
    keywords = models.TextField('Keywords')
    description = models.TextField('Description')

    class Meta:
        verbose_name = _('Site page')
        verbose_name_plural = _('Site pages')

    def __str__(self):
        return self.title
