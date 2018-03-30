from django.db.models import Q
from model_mommy import mommy
from rest_framework.test import APITestCase

from vacancies.models import Vacancy, Country, City
from vacancies.pagination import VacancyListPagination


class VacancyListTest(APITestCase):
    url = '/api/vacancies/'

    def setUp(self):
        self._create_country()
        self._create_vacancies_all()

    def test_vacancies(self):
        response = self.client.get(self.url)
        self.assertEqual(response.data.get('count'), 12)

    @staticmethod
    def _create_vacancies(count, is_main=False):
        for index in range(count):
            mommy.make(Vacancy, is_main=is_main, is_published=True)

    def _create_country(self):
        mommy.make(Country)

    def _create_vacancies_all(self):
        self._create_vacancies(5, is_main=True)
        self._create_vacancies(7, is_main=False)

    def test_vacancies_on_main_page(self):
        url = "{}?is_main=True".format(self.url)
        response = self.client.get(url)
        self.assertEqual(response.data.get('count'), 5)

    def test_vacancies_with_pages(self):
        # after this we have 42 vacancies
        self._create_vacancies(30)
        response = self.client.get(self.url)
        self.assertEqual(response.data.get('count'), Vacancy.published.count())
        self.assertEqual(response.data.get('count'), 42)
        self.assertEqual(len(response.data.get('results', {})), VacancyListPagination.default_limit)
        self.assertFalse(response.data.get('previous'))
        self.assertIsNotNone(response.data.get('next'))

        # second page exists previous 20 vacancies
        second_page_url = response.data.get('next')
        response = self.client.get(second_page_url)
        self.assertEqual(len(response.data.get('results', {})), VacancyListPagination.default_limit * 2)
        self.assertEqual(response.data.get('previous'), 'http://testserver{}?page=1'.format(self.url))
        self.assertIsNotNone(response.data.get('next'))

        # third page exists previous 40 vacancies + 2 vacancies from last page
        third_page_url = response.data.get('next')
        response = self.client.get(third_page_url)
        self.assertEqual(len(response.data.get('results', {})), VacancyListPagination.default_limit * 2 + 2)
        self.assertIsNone(response.data.get('next'))
        self.assertEqual(response.data.get('previous'), 'http://testserver{}?page=2'.format(self.url))

    def test_list_vacancies_by_filter_country(self):
        country = Country.objects.first()
        count_country = Vacancy.objects.filter(country=country).count()

        url = "{}?country={}".format(self.url, country.slug)
        response = self.client.get(url)
        self.assertEqual(len(response.data.get('results')), count_country)

    def test_list_vacancies_by_filter_cities(self):
        country_name = 'Russia'
        city_name = 'Moscow'
        country = mommy.make(Country, name=country_name)
        city = mommy.make(City, country=country, name=city_name)
        mommy.make(Vacancy, is_published=True, country=country, cities=[city])
        mommy.make(Vacancy, is_published=True, country=country, cities=[city])
        mommy.make(Vacancy, is_published=True, country=country)
        # all vacancies in this country
        url = "{}?country={}&cities={}".format(self.url, country.slug, '')
        response = self.client.get(url)
        self.assertEqual(response.data.get('count'), Vacancy.published.filter(country__name=country_name).count())
        # vacancies in one city
        # also all vacancies
        url = "{}?country={}&cities={}".format(self.url, country.slug, city.slug)
        response = self.client.get(url)
        self.assertEqual(
            response.data.get('count'),
            Vacancy.published.filter(country__name=country_name).filter(Q(cities__in=[city]) | Q(cities__isnull=True)).count()
        )
        # create another city and vacancy
        city_spb = mommy.make(City, country=country, name='Spb')
        mommy.make(Vacancy, is_published=True, country=country, cities=[city_spb])
        # previous query
        url = "{}?country={}&cities={}".format(self.url, country.slug, city.slug)
        response = self.client.get(url)
        self.assertEqual(
            response.data.get('count'),
            Vacancy.published.filter(country__name=country_name).filter(
                Q(cities__in=[city]) | Q(cities__isnull=True)).count()
        )
        # query with new city
        url = "{}?country={}&cities={}".format(self.url, country.slug, city_spb.slug)
        response = self.client.get(url)
        self.assertEqual(
            response.data.get('count'),
            Vacancy.published.filter(country__name=country_name).filter(
                Q(cities__in=[city_spb]) | Q(cities__isnull=True)).count()
        )

