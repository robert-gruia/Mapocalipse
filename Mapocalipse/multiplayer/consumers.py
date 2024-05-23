import json
from channels.generic.websocket import AsyncWebsocketConsumer

class StartGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.lobby_id = self.scope['url_route']['kwargs']['lobby_id']
        self.lobby_group_name = f'lobby_{self.lobby_id}'

        await self.channel_layer.group_add(
            self.lobby_group_name,
            self.channel_name
        )
        


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.lobby_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to group
        await self.channel_layer.group_send(
            self.lobby_group_name,
            {
                'type': 'start_message',
                'message': message
            }
        )

    #method called by the type parameter in group_send
    async def start_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.lobby_id = self.scope['url_route']['kwargs']['lobby_id']
        self.lobby_group_name = f'lobby_{self.lobby_id}'

        await self.channel_layer.group_add(
            self.lobby_group_name,
            self.channel_name
        )
        


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.lobby_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to group
        await self.channel_layer.group_send(
            self.lobby_group_name,
            {
                'type': 'start_message',
                'message': message
            }
        )

    #method called by the type parameter in group_send
    async def start_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))