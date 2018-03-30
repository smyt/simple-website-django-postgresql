from django.db import models
from django.db.models import Count, F


class QuestionsManager(models.Manager):
    def get_queryset(self):
        queryset = super(QuestionsManager, self) \
            .get_queryset() \
            .prefetch_related('questions') \
            .filter(questions__is_published=True) \
            .annotate(cnt=Count(F('questions'))) \
            .filter(cnt__gt=0)
        return queryset
