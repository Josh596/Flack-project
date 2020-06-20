from flask import Flask, session, render_template, request, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecretkey'
socketio = SocketIO(app)

user = 0
channels = []
channel_member = {}
messages = {}
present_channel = 'General'
#Creating the message class
#Each message should be passed as a dictionary
class Settings():
	def __init__(self,channels, channel_member, messages):
		self.channels = channels
		self.channel_member = channel_member
		self.messages = messages
	#Adding new_message to message dictionary
	def add_messages(self, message):
		if type(message) is dict:
			for channel_name in message:
				if channel_name in channels: 
					for key, value in message.items():
						if messages.get(key) != None:
							messages.get(key).append(value)
		else:
			pass
		
	#Adding a new channel
	def add_channel(self, channel):
		if channel in channels:
			return 'Channel already exists'
		else:
			channels.append(channel)
			channel_member[channel] = []
			messages[channel] = []
	#Adding new_member to channel
	def add_member(self, user):
		if type(user) is dict:
			for key, value in user:
				channel_member.get(key).append(value)
	
	
			

chat = Settings(channels, channel_member, messages)

@app.route('/')
def index():
	return render_template('layout.html', channels = channels, present_channel = present_channel)

@socketio.on('username')
def username(data):
	global user 
	user = data
	

chat.add_channel('General')
chat.add_messages({'General':{'adm':"Hi, welcome to the general channel"}})
chat.add_messages({'General':{'Josh':"My message"}})
chat.add_messages({'General':{'Lola':"My message"}})
chat.add_messages({'General':{'Emma':"My main_guy"}})

@socketio.on('new_message')
def new_message(data):
	print(data)
	chat.add_messages({data.get('channel_name'):{data['user'] : data['user_message']}})
	channel_message = data['user_message']
	emit('new_message', channel_message, broadcast = True, include_self = False)

@socketio.on('load_channel')
def load_channel(data):
	channel_message =  messages[data]
	present_channel = data
	print(present_channel)
	print(messages[data])
	emit('load_channel', channel_message)
	


@socketio.on('create_channel')
def create_channel(data):
	num = 1
	if data in channels:
		data = f'{data}{num}'
		num += 1
		chat.add_channel(data)
	chat.add_channel(data)
	alert = 'Channel Created'
	emit('create_channel', {'alert':alert, 'channel_name': data }, broadcast = True, include_self = True)
	print (channels)

print(messages['General'])
print(messages)
print(channels)

if __name__ == "__main__":
	socketio.run(app, debug = True)
