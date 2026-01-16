import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  
  private socket: WebSocket | undefined;
  private messageSubject: Subject<any> = new Subject<any>();

  constructor() {}

  // Establish a connection to the WebSocket
  connect(url: string): void {
    this.socket = new WebSocket(url);
    console.log('this.socket', this.socket)
    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
        console.log('event', event)
      this.messageSubject.next(event.data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  // Send message to the WebSocket server
  sendMessage(message: string): void {
    // console.log(message)
    // console.log(this.socket)
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  }

  // Observable for receiving messages from WebSocket
  getMessages(): Observable<any> {
    return this.messageSubject.asObservable().pipe(share());
  }

  // Close the WebSocket connection
  closeConnection(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
