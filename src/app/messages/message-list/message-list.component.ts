import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message('1', 'Test subject #1', 'Test message number 1... doing this to make it longer.', 'Matthew'),
    new Message('2', 'Test subject #2', 'Test message number 2... doing this to make it longer, even longer!', 'Matthew'),
    new Message('3', 'Test subject #3', 'Test message number 3... doing this to make it longer, even longer longer!!', 'Matthew'),
    new Message('4', 'Test subject #4', 'Test message number 4... doing this to make it longer, even longer longer longer!!!', 'Matthew'),
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
