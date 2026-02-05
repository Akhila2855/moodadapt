
from django.db import models
from django.contrib.auth.models import User

class MoodEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    score = models.IntegerField()
    label = models.CharField(max_length=50)
    emoji = models.CharField(max_length=5)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} felt {self.label} at {self.timestamp}"

class GameScore(models.Model):
    GAME_CHOICES = [
        ('puzzle', 'Sliding Puzzle'),
        ('guess', 'Number Guess'),
        ('maze', 'Path Finder'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    game_type = models.CharField(max_length=20, choices=GAME_CHOICES)
    score = models.IntegerField()
    moves = models.IntegerField(null=True, blank=True)
    time_taken = models.IntegerField() # in seconds
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score', '-timestamp']

    def __str__(self):
        return f"{self.user} - {self.game_type}: {self.score}"
