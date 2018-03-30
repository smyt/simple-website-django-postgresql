from unittest.mock import patch
from django.test import TestCase
from rest_framework.test import APIRequestFactory

from vacancies.messages import FORM_SUCCESS_TEXT, CAPTCHA_ERROR_TEXT
from vacancies.views import QuestionApiView


class QuestionSerializerTest(TestCase):
    data = {
        'fio': 'fio',
        'email': 'test@test.ru',
        'comment': 'comment',
    }

    def test_send_form_question(self):
        # patch for pass google captcha
        with patch('vacancies.views.check_captcha', new=lambda val: True):
            view = QuestionApiView.as_view()
            factory = APIRequestFactory()
            request = factory.post('/', self.data)
            response = view(request)

            self.assertTrue(response.data['success'])
            self.assertEqual(response.data['messageText'], FORM_SUCCESS_TEXT)

    def test_send_invalid_form_question_without_comment(self):
        data = self.data.copy()
        del data['comment']
        # patch for pass google captcha
        with patch('vacancies.views.check_captcha', new=lambda val: True):
            view = QuestionApiView.as_view()
            factory = APIRequestFactory()
            request = factory.post('/', data)
            response = view(request)

            self.assertFalse(response.data['success'])
            self.assertEqual(response.data['errorText'], {'comment': ['Это поле обязательно.']})

    def test_send_question_form_invalid_captcha(self):
        view = QuestionApiView.as_view()
        factory = APIRequestFactory()
        request = factory.post('/', self.data)
        response = view(request)

        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['errorText'], {'captcha': [CAPTCHA_ERROR_TEXT, ]})