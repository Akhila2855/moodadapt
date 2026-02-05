
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import MoodEntry, GameScore
import json

def index(request):
    """Serve the main React application entry point."""
    return render(request, 'index.html')

def save_mood(request):
    """Save the user's selected mood to session and database."""
    if request.method == 'POST':
        data = json.loads(request.body)
        score = data.get('score')
        label = data.get('label')
        emoji = data.get('emoji')
        
        # Store in session
        request.session['current_mood'] = {'score': score, 'label': label, 'emoji': emoji}
        
        # Save to DB if user authenticated
        if request.user.is_authenticated:
            MoodEntry.objects.create(user=request.user, score=score, label=label, emoji=emoji)
            
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'failed'}, status=400)

def submit_score(request):
    """Submit a game score for the leaderboard."""
    if request.method == 'POST':
        data = json.loads(request.body)
        if request.user.is_authenticated:
            GameScore.objects.create(
                user=request.user,
                game_type=data.get('game_type'),
                score=data.get('score'),
                moves=data.get('moves'),
                time_taken=data.get('time_taken')
            )
            return JsonResponse({'status': 'score_saved'})
        return JsonResponse({'status': 'guest_score_not_saved'})
    return JsonResponse({'status': 'invalid_request'}, status=400)

def get_leaderboard(request, game_type):
    """Get the top 10 scores for a specific game."""
    scores = GameScore.objects.filter(game_type=game_type).select_related('user')[:10]
    data = [{
        'username': s.user.username if s.user else 'Guest',
        'score': s.score,
        'timestamp': s.timestamp.strftime('%Y-%m-%d')
    } for s in scores]
    return JsonResponse({'leaderboard': data})
