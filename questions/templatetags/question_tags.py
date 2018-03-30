from django import template

from questions.models import Question
from vacancies.serializers import QuestionSerializer

register = template.Library()


@register.inclusion_tag('questions/tags/question_form.html', takes_context=True)
def question_form(context):
    request = context['request']

    if not request.POST:
        serializer = QuestionSerializer()
    else:
        serializer = QuestionSerializer(data=request.POST)

        if serializer.is_valid():
            pass

    return {
        'serializer': serializer,
    }


@register.inclusion_tag('questions/tags/questions_main.html')
def main_questions():
    questions = Question.objects.filter(is_published=True, is_main=True)

    return {
        'questions': questions,
    }
