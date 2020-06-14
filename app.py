from flask import Flask, session, render_template, request, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecretkey'
socketio = SocketIO(app)

channels = []
channel_member = {}
messages = {}
#Creating the message class
#Each message should be passed as a dictionary
class Messages():
	def __init__(self,channels, channel_member, messages):
		self.channels = channels
		self.channel_member = channel_member
		self.messages = messages
	#Adding new_message to message dictionary
	def add_messages(self, message):
		if type(message) is dict:
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
		

main_class = Messages(channels, channel_member, messages)
@app.route('/')
def index():
	return render_template('layout.html', channels = channels, channel_member = channel_member, messages = messages)

@socketio.on('sent_text')
def text(data):
	messages[data[channel]].append(data[messages]) 
	
@socketio.on('new_channel')
def channel(data):
	if data in channels:
		channel = {'alert':'Channel already exists'}
	else:
		channels.append(data)
		channel = {'alert': 'Channel created'}
	return channel

main_class.add_messages({'General':"My message"})

main_class.add_channel('Best')
main_class.add_messages({'Best':"My gee"})

if __name__ == "__main__":
	socketio.run(app, debug = True)