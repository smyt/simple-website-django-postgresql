from django.db import models
from .consts import MAIN_PAGE, VACANCY_LIST, VACANCY_PAGE, QUESTION_LIST


class SeoPage(models.Model):
    choices = (
        (MAIN_PAGE, 'Главная страница сайта'),
        (VACANCY_LIST, 'Страница со списком вакансий'),
        (VACANCY_PAGE, 'Cтраница с вакансией сайта'),
        (QUESTION_LIST, 'Страница со списком вопросов'),
    )
    type_page = models.CharField('Тип страницы', choices=choices, max_length=255, unique=True)
    title = models.CharField('Заголовок страницы', max_length=255)
    keywords = models.TextField('Keywords')
    description = models.TextField('Description')

    class Meta:
        verbose_name = 'Страница сайта'
        verbose_name_plural = 'Страницы сайта'

    def __str__(self):
        return self.title
