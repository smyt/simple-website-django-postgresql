from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIRequestFactory

from vacancies.serializers import ResumeSerializer
from vacancies.views import MainPageView, ComplaintApiView
from vacancies.messages import CAPTCHA_ERROR_TEXT, COMPLAINT_FORM_SUCCESS_TEXT


class ResumeSerializerCases(TestCase):
    data = {
        'fio': 'fio',
        'email': 'test@test.ru',
        'comment': 'comment',
        'phone': '+79267862345'
    }

    def test_resume_serializer_valid(self):
        serializer = ResumeSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())

    def test_resume_serializer_invalid(self):
        data = self.data.copy()
        del data['phone']
        serializer = ResumeSerializer(data=data)
        self.assertFalse(serializer.is_valid())

    def test_send_form_resume(self):
        # patch for pass google captcha
        with patch('vacancies.views.check_captcha', new=lambda val: True):
            view = MainPageView.as_view()
            factory = APIRequestFactory()
            request = factory.post('/', self.data)
            response = view(request)
            self.assertTrue(response.data['success'])

    def test_send_resume_invalid_captcha(self):
        view = MainPageView.as_view()
        factory = APIRequestFactory()
        request = factory.post('/', self.data)
        response = view(request)

        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['errorText'], {'captcha': [CAPTCHA_ERROR_TEXT, ]})


class ComplaintSerializerCases(TestCase):
    data = {
        'fio': 'fio',
        'email': 'test@test.ru',
        'comment': 'comment',
    }

    def test_send_form_complaint(self):
        # patch for pass google captcha
        with patch('vacancies.views.check_captcha', new=lambda val: True):
            view = ComplaintApiView.as_view()
            factory = APIRequestFactory()
            request = factory.post('/', self.data)
            response = view(request)
            self.assertTrue(response.data['success'])
            self.assertEqual(response.data['messageText'], COMPLAINT_FORM_SUCCESS_TEXT)

    def test_send_invalid_form_complaint(self):
        data = self.data.copy()
        del data['fio']
        # patch for pass google captcha
        with patch('vacancies.views.check_captcha', new=lambda val: True):
            view = ComplaintApiView.as_view()
            factory = APIRequestFactory()
            request = factory.post('/', data)
            response = view(request)
            self.assertFalse(response.data['success'])
            self.assertEqual(response.data['errorText'], {'fio': ['Данное поле является обязательным для заполнения']})

    def test_send_form_invalid_captcha(self):
        view = ComplaintApiView.as_view()
        factory = APIRequestFactory()
        request = factory.post('/', self.data)
        response = view(request)
        self.assertFalse(response.data['success'])
        self.assertEqual(response.data['errorText'], {'captcha': [CAPTCHA_ERROR_TEXT, ]})
