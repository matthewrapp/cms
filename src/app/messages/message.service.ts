import { EventEmitter, Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({ providedIn: 'root' })
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
  }

  getMaxId(): number {
    let maxId: number = 0;
    const numArr = this.messages.map(msg => parseInt(msg.id));
    maxId = Math.max(...numArr);
    return maxId;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    // this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }

  getMessages() {
    // return this.messages.slice();
    this.http.get<Message[]>('https://wdd430-cms-3f0cd-default-rtdb.firebaseio.com/messages.json')
      .subscribe((messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messages.sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        })
        this.messageChangedEvent.next(this.messages.slice());
      })

      return this.messages;
  }

  getMessage(id: string) {
    return this.messages.find(message => message.id === id ? message : null);
  }

  storeMessages() {
    const msgString: string = JSON.stringify(this.messages);
    this.http.put('https://wdd430-cms-3f0cd-default-rtdb.firebaseio.com/messages.json', msgString)
      .subscribe(updatedMsgArr => {
        this.messageChangedEvent.next(this.messages.slice())
      })
  }

}
