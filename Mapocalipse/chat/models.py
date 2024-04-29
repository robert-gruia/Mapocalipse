from django.db import models
from django.contrib.auth import get_user_model
import json
import os

User = get_user_model()

class Chat(models.Model):
    chat_id = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2')
    json_path = models.CharField(max_length=255)

    def create_chat(self, user1, user2):
        self.user1 = user1
        self.user2 = user2
        self.save() 

        self.json_path = f'chats/chat_{self.chat_id}.json'
        if not os.path.isfile(self.json_path):
            with open(self.json_path, 'w') as f:
                json.dump([], f)
        self.save()

    def save_messages_to_json(self, messages):
        with open(self.json_path, 'w') as f:
            json.dump(messages, f)

class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    message = models.TextField()

    def create_message(self, user, chat, message):
        self.user = user
        self.chat = chat
        self.message = message
        self.save()