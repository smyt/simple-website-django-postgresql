from ckeditor.fields import RichTextField
from django.db import models
from django.utils.translation import gettext_lazy as _

from questions.managers import QuestionsManager
from vacancies.models import Priority


class Category(Priority):
    name = models.CharField(_('Category name'), max_length=50)

    objects = models.Manager()
    published_questions = QuestionsManager()

    class Meta:
        verbose_name = _('Questions section')
        verbose_name_plural = _('Questions sections')
        ordering = ('-priority', 'name')

    def __str__(self):
        return self.name


class Question(Priority):
    text = models.CharField(_('Question text'), max_length=255)
    answer = RichTextField(_('Answer text'), null=True)
    category = models.ForeignKey(Category, verbose_name=_('Questions section'), related_name='questions')
    is_published = models.BooleanField(_('Is published'), default=False)
    is_main = models.BooleanField(_('Show on main'), default=False)

    class Meta:
        verbose_name = _('Question')
        verbose_name_plural = _('Questions')
        ordering = ('-priority', 'text')

    def __str__(self):
        return self.text
