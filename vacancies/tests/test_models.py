from django.test import TestCase
from model_mommy import mommy

from vacancies.models import Country, City, Profile, Experience, Vacancy

mommy.generators.add('ckeditor.fields.RichTextField', lambda: 'test string')


class Cases(TestCase):
    def test_create_country(self):
        country = mommy.make(Country)
        self.assertTrue(isinstance(country, Country))
        self.assertEqual(country.__str__(), country.name)

    def test_create_city(self):
        city = mommy.make(City)
        self.assertTrue(isinstance(city, City))
        self.assertEqual(city.__str__(), "{}".format(city.name))

    @staticmethod
    def _create_cities(count, country):
        for index in range(count):
            mommy.make(City, country=country)

    def test_create_profile(self):
        profile = mommy.make(Profile)
        self.assertTrue(isinstance(profile, Profile))
        self.assertEqual(profile.__str__(), profile.name)

    def test_create_experience(self):
        exp = mommy.make(Experience)
        self.assertTrue(isinstance(exp, Experience))
        self.assertEqual(exp.__str__(), exp.name)

    def test_create_vacancy(self):
        vacancy = mommy.make(Vacancy)
        self.assertTrue(isinstance(vacancy, Vacancy))
        self.assertEqual(vacancy.__str__(), vacancy.name)

    def test_create_vacancy_several_cities(self):
        """
        5 cities for country
        """
        country = mommy.make(Country)
        cities = [(mommy.make(City, country=country)) for ind in range(5)]
        vacancy = mommy.make(Vacancy, cities=cities, country=country)
        self.assertEqual(len(vacancy.cities.all()), 5)

    @staticmethod
    def _create_vacancies(count=1, params=None):
        if not params:
            params = {}
        vacancies = []
        for index in range(count):
            vacancy = mommy.make(Vacancy, priority=index, **params)
            vacancies.append(vacancy)
        return vacancies

    def test_vacancy_sort_by_priority(self):
        """
        In result list at the beginning of list should be vacancy with greater priority
        """

        vacancies = self._create_vacancies(20)
        self.assertEqual(Vacancy.objects.first().pk, vacancies[-1].pk)
        self.assertEqual(Vacancy.objects.last().pk, vacancies[0].pk)

    def test_manager_published(self):
        self._create_vacancies(11, {'is_published': False})
        self._create_vacancies(9, {'is_published': True})
        count_all_vacancies = Vacancy.objects.count()
        count_published_vacancies = Vacancy.published.count()
        count_unpublished_vacancies = count_all_vacancies - count_published_vacancies

        self.assertEqual(count_all_vacancies, 20)
        self.assertEqual(count_published_vacancies, 9)
        self.assertEqual(count_unpublished_vacancies, 11)
