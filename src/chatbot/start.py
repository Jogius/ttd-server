# ChatterBot Initialization
from chatterbot import ChatBot

bot = ChatBot(
    'ttd',
    database_uri=f'sqlite:///data/db/chatbot.sqlite3'
)

# SocketIO Initialization
from aiohttp import web
import json

async def getResponse(req):
    body= await req.json()
    response = {
        'response': bot.get_response(body['message']).__str__()
    }
    print(body['message'], ' --> ', response['response'])
    return web.Response(body=json.dumps(response))

app = web.Application()
app.add_routes([web.post('/', getResponse)])
web.run_app(app, host='localhost', port=1215)
