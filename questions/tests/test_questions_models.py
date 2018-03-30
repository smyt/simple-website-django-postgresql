from django.test import TestCase
from model_mommy import mommy

from questions.models import Question, Category


class QuestionCases(TestCase):
    def test_create_question(self):
        question = mommy.make('questions.Question')
        self.assertTrue(isinstance(question, Question))
        self.assertEqual(question.__str__(), question.text)

    def test_create_category_questions(self):
        category = mommy.make('questions.Category')
        self.assertTrue(isinstance(category, Category))
        self.assertEqual(category.__str__(), category.name)

    def _create_questions(self, count, params=None):
        if not params:
            params = {}
        for i in range(count):
            mommy.make('questions.Question', **params)

    def test_published_questions(self):
        self._create_questions(5, {'is_published': True})
        self._create_questions(12, {'is_published': False})
        self.assertEqual(Category.published_questions.count(), 5)

    def test_count_categories_with_no_questions(self):
        category1 = mommy.make('questions.Category')
        category2 = mommy.make('questions.Category')
        category3 = mommy.make('questions.Category')
        category4 = mommy.make('questions.Category')

        self._create_questions(4, {'category': category2, 'is_published': True})
        self._create_questions(9, {'category': category3, 'is_published': True})
        self.assertEqual(Category.objects.count(), 4)
        self.assertEqual(Category.published_questions.count(), 2)

    def test_questions_on_main(self):
        self._create_questions(4, {'is_published': True, 'is_main': True})
        self._create_questions(5, {'is_published': True, 'is_main': False})
        self._create_questions(6, {'is_published': False, 'is_main': False})
        self.assertEqual(Question.objects.count(), 15)
        self.assertEqual(Question.objects.filter(is_published=True).count(), 9)
        self.assertEqual(Question.objects.filter(is_published=True, is_main=True).count(), 4)
