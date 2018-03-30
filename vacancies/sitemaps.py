from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from vacancies.models import Vacancy


class VacancySitemap(Sitemap):
    def items(self):
        return Vacancy.published.all()

    def location(self, obj):
        url = reverse('vacancy-detail', kwargs={'slug': obj.slug})
        return url
