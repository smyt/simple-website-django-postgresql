from django.contrib import admin
from .models import Question, Category


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'priority', )


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'category', 'is_published', 'is_main', 'priority')
    list_filter = ('category', 'is_published', 'is_main')
    search_fields = ('text', )

admin.site.register(Question, QuestionAdmin)
admin.site.register(Category, CategoryAdmin)

