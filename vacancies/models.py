from ckeditor.fields import RichTextField
from django.db import models
from smart_selects.db_fields import ChainedManyToManyField
from autoslug import AutoSlugField

from vacancies.managers import PublishedVacanciesManager


class Priority(models.Model):
    priority = models.PositiveIntegerField('Приоритет отображения', default=0,
                                           help_text='Укажите значения от 1 до 100, где у 100 высший приоритет. '
                                                     'Если не указать приоритет, он будет равен 0')

    class Meta:
        abstract = True


class Slug(models.Model):
    slug = AutoSlugField('Путь', null=True, unique=True, populate_from='name', editable=True)

    class Meta:
        abstract = True


class Country(Priority, Slug):
    name = models.CharField('Название страны', max_length=50)
    name_in_case = models.CharField('Название страны в родительном падеже', max_length=50, default='')

    class Meta:
        verbose_name = 'Страна'
        verbose_name_plural = 'Страны'
        ordering = ('-priority', 'name')

    def __str__(self):
        return self.name


class City(Priority, Slug):
    name = models.CharField('Название города', max_length=50)
    country = models.ForeignKey(Country, verbose_name='Страна', related_name='cities')

    class Meta:
        verbose_name = 'Город'
        verbose_name_plural = 'Города'
        ordering = ('-priority', 'name')

    def __str__(self):
        return self.name


class Profile(Priority, Slug):
    name = models.CharField('Название направления', max_length=100)

    class Meta:
        verbose_name = 'Направление'
        verbose_name_plural = 'Направления'
        ordering = ('-priority', 'name')

    def __str__(self):
        return self.name


class Experience(Priority, Slug):
    name = models.CharField('Название уровня', max_length=50)

    class Meta:
        verbose_name = 'Уровень'
        verbose_name_plural = 'Уровни'
        ordering = ('-priority', 'name')

    def __str__(self):
        return self.name


class Vacancy(Priority):
    name = models.CharField('Название вакансии', max_length=50)
    text_main = RichTextField('Текст описания для отображения на главной', blank=True, null=True)
    text_inner = RichTextField('Текст описания внутри вакансии')
    text_experience = RichTextField('Текст "Опыт и знания')
    text_desc = RichTextField('Описание работы')
    text_qualifying = RichTextField('Отборочный цикл')
    country = models.ForeignKey(Country, verbose_name='Страна')

    cities = ChainedManyToManyField(
        City,
        horizontal=True,
        auto_choose=True,
        chained_field='country',
        chained_model_field='country',
        verbose_name='Города',
        blank=True
    )

    profile = models.ForeignKey(Profile, verbose_name='Направление')
    experience = models.ForeignKey(Experience, verbose_name='Уровень')
    is_main = models.BooleanField('На главной', default=False)
    is_published = models.BooleanField('Опубликована', default=False)
    slug = models.SlugField('Путь', null=True, unique=True)

    objects = models.Manager()
    published = PublishedVacanciesManager()

    class Meta:
        verbose_name = 'Вакансия'
        verbose_name_plural = 'Вакансии'
        ordering = ('-priority', 'name')

    def __str__(self):
        return self.name
