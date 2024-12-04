from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@socketio.on('connect')
def handle_connect():
    print('Client connected to WebSocket')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected from WebSocket')

@socketio.on('scooter_status_update')
def handle_scooter_status_update(data):
    """
    Handle real-time status updates from scooters.
    Expected data: {'scooter_id': int, 'status': str, 'battery': int}
    """
    print(data)

if __name__ == '__main__':
    socketio.run(app, debug=True)
