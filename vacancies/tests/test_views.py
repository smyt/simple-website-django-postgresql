from django.test import TestCase
from django.urls import reverse


class Cases(TestCase):
    def test_main_page(self):
        url = reverse('home')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)

    def test_vacancies_page(self):
        url = reverse('vacancy-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
