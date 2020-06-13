from flask import Flask, session, render_template, request, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecretkey'
socketio = SocketIO(app)

channels = []
channel_member = {}
messages = {}
def append_function():
	for channel in channels:
		channel_member[channel] = []
		messages[channel] = []
channels.append('General')
append_function()


@app.route('/')
def index():
	return render_template('layout.html')

@socketio.on('sent_text')
def text(data):
	messages[data[channel]].append(data[messages]) 
	append_function()
@socketio.on('new_channel')
def channel(data):
	if data in channels:
		channel = {'alert':'Channel already exists'}
	else:
		channels.append(data)
		channel = {'alert': 'Channel created'}
	append_function()
print(messages)

