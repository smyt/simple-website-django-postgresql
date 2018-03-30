from ckeditor.fields import RichTextField
from django.db import models

from questions.managers import QuestionsManager
from vacancies.models import Priority


class Category(Priority):
    name = models.CharField('Название категории', max_length=50)

    objects = models.Manager()
    published_questions = QuestionsManager()

    class Meta:
        verbose_name = 'Раздел вопросов'
        verbose_name_plural = 'Разделы вопросов'
        ordering = ('-priority', 'name')

    def __str__(self):
        return self.name


class Question(Priority):
    text = models.CharField('Текст вопроса', max_length=255)
    answer = RichTextField('Текст ответа', null=True)
    category = models.ForeignKey(Category, verbose_name='Раздел вопроса', related_name='questions')
    is_published = models.BooleanField('Опубликован', default=False)
    is_main = models.BooleanField('На главной', default=False)

    class Meta:
        verbose_name = 'Вопрос'
        verbose_name_plural = 'Вопросы'
        ordering = ('-priority', 'text')

    def __str__(self):
        return self.text
