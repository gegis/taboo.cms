import socketIOClient from 'socket.io-client';
import { stores } from 'app/modules/core/client/stores.config';

class SocketsClient {
  constructor() {
    const { sockets: { port = null, host = null, path = '/socket.io' } = {} } = window.app.config;
    this.sockets = null;
    this.host = host || window.location.origin;
    this.port = port;
    this.path = path;
    this.socketDisconnectCount = 0;
    this.reconnectAttempts = 0;
    this.joinedRooms = [];
    this.registeredEvents = [];
    this.connect();
  }

  connect() {
    const options = { path: this.path, reconnection: false, forceNew: true };
    if (this.port) {
      this.sockets = socketIOClient(this.host + ':' + this.port, options);
    } else {
      this.sockets = socketIOClient(this.host, options);
    }

    this.sockets.on('error', () => {
      this.reconnect(true);
    });

    this.sockets.on('disconnect', err => {
      if (this.socketDisconnectCount === 0) {
        stores.notificationsStore.push({
          title: 'Sockets Error',
          message: err,
          type: 'error',
          duration: 5000,
          translate: true,
        });
      }
      this.socketDisconnectCount++;
      this.reconnect();
    });
  }

  reconnect(disconnect = false) {
    if (disconnect) {
      this.sockets.disconnect();
    }
    this.reconnectAttempts++;
    this.sockets.connect();
  }

  join(room) {
    return new Promise(resolve => {
      this.joinedRooms.push(room);
      this.sockets.emit('join', room, resolve);
    });
  }

  leave(room) {
    const index = this.joinedRooms.indexOf(room);
    if (index !== -1) {
      this.joinedRooms.splice(index, 1);
    }
    this.sockets.emit('leave', room);
  }

  on(event, next) {
    if (event && this.registeredEvents.indexOf(event) === -1) {
      this.registeredEvents.push(event);
      this.sockets.on(event, next);
    }
  }

  off(event) {
    if (event) {
      const index = this.registeredEvents.indexOf(event);
      if (index !== -1) {
        this.registeredEvents.splice(index, 1);
        this.sockets.off(event);
      }
    }
  }

  emit(event, data) {
    this.sockets.emit(event, data);
  }
}

export default new SocketsClient();
