from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Generation(models.Model):
    user = models.ForeignKey(
        User, related_name="generations", null=True, on_delete=models.SET_NULL
    )
    object = models.CharField()
    prompt = models.CharField()
    response = models.CharField()
    generation = models.CharField(default="")
    title = models.CharField()
    time = models.DateTimeField(auto_now_add=True)


class Rating(models.Model):
    user = models.ForeignKey(
        User, related_name="user_ratings", null=True, on_delete=models.SET_NULL
    )
    generation = models.ForeignKey(
        Generation, related_name="ratings", null=True, on_delete=models.SET_NULL
    )
    rating = models.IntegerField(default=0)
    time = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    user = models.ForeignKey(
        User, related_name="user_comments", null=True, on_delete=models.SET_NULL
    )
    generation = models.ForeignKey(
        Generation, related_name="comments", null=True, on_delete=models.SET_NULL
    )
    comment = models.CharField()
    time = models.DateTimeField(auto_now_add=True)


class Favorite(models.Model):
    user = models.ForeignKey(
        User, related_name="user_favorites", null=True, on_delete=models.SET_NULL
    )
    generation = models.ForeignKey(
        Generation, related_name="favorites", null=True, on_delete=models.SET_NULL
    )
    time = models.DateTimeField(auto_now_add=True)
