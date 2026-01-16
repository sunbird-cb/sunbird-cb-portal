import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// import {  take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'
const PROXY_CREATE_V8 = '/apis/proxies/v8'
const API_END_POINTS = {
  GET_JWT_TOCKEN: `${PROXY_CREATE_V8}/fetchUserToken`
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket | undefined;
  private messageSubject: Subject<any> = new Subject<any>();
  pingIntervalId:any
  clientId:any
  constructor(
    public http: HttpClient
  ) {}

  // Establish a connection to the WebSocket
  connect(url: string): void {
    this.socket = new WebSocket(url);
    // console.log('this.socket', this.socket)
    this.socket.onopen = () => {
      try {
        console.log('WebSocket connection established');
      } catch(error) {
        console.log('error', error)
      }
      
      this.startClientPing();
    };

    this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'connection' && data.clientId) {
              this.clientId = data.clientId;
             // clientIdDisplay.textContent = `Assigned Client ID: ${this.clientId}`;
             // console.log('Server', `Connected. Assigned Client ID: ${this.clientId}`);
          } else if (data) {            
            this.messageSubject.next(data);
             // console.log('Server', `Answer: ${data.answer}`);
              // if (data.sources && data.sources.length > 0) {
              //    // console.log('Server', `Sources: ${data.sources.join(', ')}`);
              // }
              // if (data.retrievedChunks && data.retrievedChunks.length > 0) {
              //     data.retrievedChunks.forEach((chunk:any) => {
              //         if (chunk.uri && chunk.uri.length > 0) {
              //             console.log('Server', `Retrieved URI: ${chunk.uri.join(', ')}`);
              //         }
              //         if (chunk.content && chunk.content.length > 0) {
              //             console.log('Server', `Retrieved Content: ${chunk.content.join('...')}`);
              //         }
              //     });
              // }
          } else if (data.error) {
              console.log('Server', `Error: ${data.error}`);
          } else {
              //console.log('Server', `Received: ${event.data}`);
          }
      } catch (error) {
          // console.log('Server', `Received raw: ${event.data}`);
          // console.error('Error processing message:', error);
      }
      //this.messageSubject.next(event.data);
    };

    this.socket.onerror = (error) => {
      // console.log('error', error)
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  // Send message to the WebSocket server
  sendMessage(message: any): void {
    // console.log(message)
    // console.log(this.socket)
    
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }

  // Observable for receiving messages from WebSocket
  getMessages(): Observable<any> {
    return this.messageSubject.asObservable().pipe();
  }

  startClientPing() {

    clearInterval(this.pingIntervalId);
    this.pingIntervalId = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          // console.log('in')
          this.socket.send(JSON.stringify({ type: 'ping' })); // Send a ping message
            // console.log('Client sent ping');
        }
    }, 60000); // Send ping every 25 seconds (slightly less than server's 30s)
}

  // Close the WebSocket connection
  closeConnection(): void {
    if (this.socket) {
      this.socket.close();
      clearInterval(this.pingIntervalId);
    }
  }

  getJWTToken() {
    // console.log('get token')
    return this.http.get<any>(`${API_END_POINTS.GET_JWT_TOCKEN}`)
  }


}
