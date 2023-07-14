from channels.routing import ProtocolTypeRouter,URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path
from home.consumers import Boardconsumer

websocket_urlpatterns = [
    path("", Boardconsumer.as_asgi())
]