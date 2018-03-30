from django.test import TestCase
from django.urls import reverse


class Cases(TestCase):
    def test_questions_page(self):
        url = reverse('question-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
