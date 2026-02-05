
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/mood/save/', views.save_mood, name='save_mood'),
    path('api/score/submit/', views.submit_score, name='submit_score'),
    path('api/leaderboard/<str:game_type>/', views.get_leaderboard, name='leaderboard'),
    # Catch-all for SPA routing
    path('recommendations/', views.index),
    path('activities/', views.index),
    path('games/', views.index),
    path('games/<str:game_id>/', views.index),
]
