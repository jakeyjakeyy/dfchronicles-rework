from rest_framework.views import APIView
from rest_framework.response import Response
from chronicle_compiler import models
import logging
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.renderers import JSONRenderer
import openai
import os
from dotenv import load_dotenv
import tiktoken
from .serializers import *
import re

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

logger = logging.getLogger(__name__)

PAGINATION = 5


class Generations(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        try:
            generation = models.Generation.objects.get(id=pk)
            comments = CommentSerializer(
                models.Comment.objects.filter(generation=generation), many=True
            ).data
            return Response({"comments": comments})
        except models.Generation.DoesNotExist:
            return Response({"message": "Generation does not exist"})

    def post(self, request):
        if request.data["request"] == "get":
            id = int(request.data["page"])
            start = (id - 1) * PAGINATION
            end = id * PAGINATION
            generations = models.Generation.objects.all().order_by("-id")[start:end]
            serializer = GenerationSerializer(generations, many=True)
            return Response(
                {
                    "generations": serializer.data,
                    "maxpage": (len(models.Generation.objects.all())) / PAGINATION,
                }
            )
        user = request.user
        if not user.is_authenticated:
            return Response({"message": "Invalid token"})

        if request.data["request"] == "query":
            generation = request.data["generation"]
            generation = models.Generation.objects.get(id=generation)
            userfavorite = models.Favorite.objects.filter(
                user=user, generation=generation
            )
            comments = CommentSerializer(
                models.Comment.objects.filter(generation=generation), many=True
            ).data
            userrating = RatingSerializer(
                models.Rating.objects.filter(generation=generation, user=user),
                many=True,
            ).data
            if len(userrating) > 0:
                userrating = userrating[0]["rating"]
            return Response(
                {
                    "userfavorite": len(userfavorite),
                    "comments": comments,
                    "userrating": userrating,
                }
            )

        if request.data["request"] == "favorite":
            try:
                favorite = models.Favorite.objects.get(
                    user=user, generation=request.data["generation"]
                )
                favorite.delete()
                return Response({"message": "Favorite removed"})
            except models.Favorite.DoesNotExist:
                generation = models.Generation.objects.get(
                    id=request.data["generation"]
                )
                favorite = models.Favorite.objects.create(
                    user=user, generation=generation
                )
                favorite.save()
                return Response({"message": "Favorite added"})

        if request.data["request"] == "comment":
            logger.error(request.data)
            try:
                if request.data["delete"]:
                    comment = models.Comment.objects.get(id=request.data["comment"])
                    if comment.user != user:
                        return Response({"message": "Invalid token"})
                    comment.delete()
                    return Response({"message": "Comment removed"})
            except KeyError:
                pass
            generation = models.Generation.objects.get(id=request.data["generation"])
            comment = models.Comment.objects.create(
                user=user, generation=generation, comment=request.data["comment"]
            )
            comment.save()
            return Response({"message": "Comment added"})

        if request.data["request"] == "rate":
            try:
                generation = models.Generation.objects.get(
                    id=request.data["generation"]
                )
                rating = models.Rating.objects.get(user=user, generation=generation)
                rating.rating = request.data["rating"]
                if rating.rating < 1:
                    rating.delete()
                    return Response({"message": "Rating removed"})
                if rating.rating > 5:
                    rating.rating = 5
                rating.save()
                return Response({"message": "Rating updated"})
            except models.Rating.DoesNotExist:
                generation = models.Generation.objects.get(
                    id=request.data["generation"]
                )
                rating = models.Rating.objects.create(
                    user=user, generation=generation, rating=request.data["rating"]
                )
                rating.save()
                return Response({"message": "Rating added"})


class User(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({"message": "Invalid token"})
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({"message": "Invalid token"})

        try:
            if request.data["fetch"] == "favorites":
                favorites = request.data["favorites"]
                generations = []
                for favorite in favorites:
                    favobject = FavoriteSerializer(
                        models.Favorite.objects.get(id=favorite)
                    ).data
                    gen = GenerationSerializer(
                        models.Generation.objects.get(id=favobject["generation"])
                    ).data
                    if favobject["generation"] not in generations:
                        generations.append(gen)
                return Response({"generations": generations})
            elif request.data["fetch"] == "comments":
                comments = request.data["comments"]
                generations = []
                used = []
                for comment in comments:
                    comobject = CommentSerializer(
                        models.Comment.objects.get(id=comment)
                    ).data
                    gen = GenerationSerializer(
                        models.Generation.objects.get(id=comobject["generation"])
                    ).data
                    if gen["id"] not in used:
                        generations.append(gen)
                        used.append(gen["id"])
                return Response({"generations": generations})
            elif request.data["fetch"] == "generations":
                generationIds = request.data["generations"]
                generations = []
                for generation in generationIds:
                    gen = GenerationSerializer(
                        models.Generation.objects.get(id=generation)
                    ).data
                    generations.append(gen)
                return Response({"generations": generations})
        except KeyError:
            pass


class Generate(APIView):
    authentication_classes = [JWTAuthentication]
    prompt = 'In a realm shaped by the intricate mechanics of the game "Dwarf Fortress", imagine yourself as a skilled archivist dedicated to preserving the rich tapestry of events and history in this unique world. Your mission is to craft an engaging and enthralling narrative using the information at your disposal. While remaining true to the established facts, infuse the story with vivid details that may not explicitly be provided to you, in order to captivate the reader.The beginning of your response should start with you creating a title for your story encased in triple quotes("""title"""). Prose: J.R.R. Tolkien meets George R.R. Martin. The story should be a blend of high fantasy and gritty realism, with a focus on character development and world-building. The narrative should be engaging, immersive, and evoke a sense of wonder and intrigue in the reader. The story should be suitable for a mature audience and may contain elements of violence, intrigue, and political machinations.'

    def post(self, request):
        if not openai.api_key:
            title = "Default Title"
            generation = "\nDefault Generation. This response is a placeholder because the OpenAI API key is not set.\nPlease set your API key in the .env file if you want to use this feature."
            gen = models.Generation.objects.create(
                user=request.user,
                object="Default Generation",
                prompt="Default Generation",
                response="Default Response",
                generation=generation,
                title=title,
            )
            gen.save()
            gen = GenerationSerializer(gen).data
            return Response({"generation": gen})
        user = request.user
        # model = "gpt-3.5-turbo"
        model = "gpt-4o"
        maxTokens = 3000
        if model == "gpt-4-1106-preview":
            maxTokens = 4000
        if model == "gpt-4o":
            maxTokens = 8000
        if not user.is_authenticated:
            return Response({"message": "Invalid token"})

        if request.data["request"] == "generate":
            enc = tiktoken.encoding_for_model(model)
            if len(enc.encode(request.data["prompt"])) > maxTokens:
                return Response(
                    {
                        "message": f"Prompt too long {len(enc.encode(request.data['prompt']))} of 3000 tokens"
                    }
                )
            try:
                completion = openai.ChatCompletion.create(
                    model=model,
                    messages=[
                        {
                            "role": "system",
                            "content": self.prompt,
                        },
                        {"role": "user", "content": request.data["prompt"]},
                    ],
                    temperature=0.7,
                    top_p=0.8,
                )
            except openai.error.ServiceUnavailableError:
                return Response(
                    {"message": "OpenAI API is currently unavailable. Try again later."}
                )
            except openai.error.APIError:
                return Response(
                    {
                        "message": "Error from OpenAI API, their servers are probably having issues. Try again later."
                    }
                )

            # Extract title from response
            pattern = r'"""(.*?)"""'
            match = re.search(pattern, completion["choices"][0]["message"]["content"])
            extracted_text = match.group(1) if match else ""

            response = re.sub(
                pattern, "", completion["choices"][0]["message"]["content"]
            )

            gen = models.Generation.objects.create(
                user=user,
                object=request.data["prompt"],
                prompt=self.prompt,
                response=completion,
                generation=response,
                title=extracted_text,
            )
            gen.save()
            gen = GenerationSerializer(gen).data

            return Response({"generation": gen})


class Register(APIView):
    def post(self, request):
        if request.data["request"] == "register":
            try:
                user = models.User.objects.create_user(
                    username=request.data["username"].lower,
                    password=request.data["password"],
                )
                user.save()
                return Response({"message": "User created"})
            except:
                return Response({"message": "User already exists"})
        else:
            return Response({"message": "Invalid request"})
