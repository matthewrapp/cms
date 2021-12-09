import { EventEmitter, Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { Message } from './message.model';
// import { MOCKMESSAGES } from './MOCKMESSAGES';
import { stringify } from 'querystring';

@Injectable({ providedIn: 'root' })
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: HttpClient) {
    // this.messages = this.getMessages();
  }

  sortAndSend() {
    const msgListClone = this.messages.slice();
    this.messageChangedEvent.emit(msgListClone);
  }

  // getMaxId(): number {
  //   let maxId: number = 0;
  //   const numArr = this.messages.map(msg => parseInt(msg.id));
  //   maxId = Math.max(...numArr);
  //   return maxId;
  // }

  addMessage(message: Message) {
    if (!message) return
    message.id = ''
    
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // add to db
    this.http.post<{message: Message}>('http://localhost:3000/messages', message, {headers: headers})
      .subscribe(responseData => {
        // const m = new Message(responseData['document'].id, responseData['document'].subject, responseData['document'].msgText, responseData['contact']);
        this.messages.push(message);
        this.sortAndSend();
      })

    // this.storeMessages();
  }

  getMessages() {
    // return this.messages.slice();
    this.http.get<{message: string, messages: Message[]}>('http://localhost:3000/messages')
      .subscribe(responseData => {
        this.messages = responseData.messages;
        // this.maxMessageId = this.getMaxId();
        // this.messages.sort((a, b) => {
        //   if (a < b) return -1;
        //   if (a > b) return 1;
        //   return 0;
        // });
        this.sortAndSend();
      })
      // return this.messages;
  }

  getMessage(id: string) {
    return this.messages.find(message => message.id === id ? message : null);
  }

  // storeMessages() {
  //   const msgString: string = JSON.stringify(this.messages);
  //   this.http.put('https://wdd430-cms-3f0cd-default-rtdb.firebaseio.com/messages.json', msgString)
  //     .subscribe(updatedMsgArr => {
  //       this.messageChangedEvent.next(this.messages.slice())
  //     })
  // }

}
