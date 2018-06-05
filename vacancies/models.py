from autoslug import AutoSlugField
from ckeditor.fields import RichTextField
from django.db import models
from django.utils.translation import gettext_lazy as _
from smart_selects.db_fields import ChainedManyToManyField

from vacancies.managers import PublishedVacanciesManager


class Priority(models.Model):
    priority = models.PositiveIntegerField(_('Display priority'), default=0,
                                           help_text=_('Specify values from 1 to 100, '
                                                       'where 100 has the highest priority. '
                                                       'If you do not specify a priority, it will be 0'))

    class Meta:
        abstract = True


class Slug(models.Model):
    slug = AutoSlugField(_('Path'), null=True, unique=True, populate_from='name', editable=True)

    class Meta:
        abstract = True


class Country(Priority, Slug):
    name = models.CharField(_('Country name'), max_length=50)
    name_in_case = models.CharField(_('Country name in parental case'), max_length=50, default='')

    class Meta:
        verbose_name = _('Country')
        verbose_name_plural = _('Countries')
        ordering = ('-priority', 'name')

    def __str__(self):
        return self.name


class City(Priority, Slug):
    name = models.CharField(_('City name'), max_length=50)
    country = models.ForeignKey(Country, verbose_name=_('Country'), related_name='cities')

    class Meta:
        verbose_name = _('City')
        verbose_name_plural = _('Cities')
        ordering = ('-priority', 'name')

    def __str__(self):
        return self.name


class Profile(Priority, Slug):
    name = models.CharField(_('Profile name'), max_length=100)

    class Meta:
        verbose_name = _('Profile')
        verbose_name_plural = _('Profiles')
        ordering = ('-priority', 'name')

    def __str__(self):
        return self.name


class Experience(Priority, Slug):
    name = models.CharField(_('Level experience name'), max_length=50)

    class Meta:
        verbose_name = _('Level experience')
        verbose_name_plural = _('Levels experience')
        ordering = ('-priority', 'name')

    def __str__(self):
        return self.name


class Vacancy(Priority):
    name = models.CharField(_('Vacancy name'), max_length=50)
    text_main = RichTextField(_('Description text for display on main page'), blank=True, null=True)
    text_inner = RichTextField(_('Description text for display on vacancy page'))
    text_experience = RichTextField(_('Description text of experience and knowledge'))
    text_desc = RichTextField(_('Work description text'))
    text_qualifying = RichTextField(_('Description text for qualifying'))
    country = models.ForeignKey(Country, verbose_name=_('Country'))

    cities = ChainedManyToManyField(
        City,
        horizontal=True,
        auto_choose=True,
        chained_field='country',
        chained_model_field='country',
        verbose_name=_('Cities'),
        blank=True
    )

    profile = models.ForeignKey(Profile, verbose_name=_('Profile'))
    experience = models.ForeignKey(Experience, verbose_name=_('Level experience'))
    is_main = models.BooleanField(_('Show on main'), default=False)
    is_published = models.BooleanField(_('Is published'), default=False)
    slug = models.SlugField(_('Path'), null=True, unique=True)

    objects = models.Manager()
    published = PublishedVacanciesManager()

    class Meta:
        verbose_name = _('Vacancy')
        verbose_name_plural = _('Vacancies')
        ordering = ('-priority', 'name')

    def __str__(self):
        return self.name
