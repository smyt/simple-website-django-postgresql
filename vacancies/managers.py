from django.db import models


class PublishedVacanciesManager(models.Manager):
    def get_queryset(self):
        queryset = super().get_queryset() \
            .filter(is_published=True)
        return queryset
