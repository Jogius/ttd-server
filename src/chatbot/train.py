# ChatterBot Initialization
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

bot = ChatBot(
    'ttd',
    database_uri=f'sqlite:///data/db/chatbot.sqlite3'
)

trainer = ChatterBotCorpusTrainer(bot)

trainer.train(f'./data/training/default')
