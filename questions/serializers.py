from rest_framework.serializers import ModelSerializer

from .models import Question, Category


class QuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = ('text', 'answer',)


class QuestionCategorySerializer(ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Category
        fields = ('name', 'questions')
