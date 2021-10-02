import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  // QUESTIONS:
  ///// 1) why do I have to add {static: true}?
  ///// 2) why do I have to add '!' at the end? If I didn't I would keep getting an error.
  ///// 3) why is ViewChild a better way of doing things, if I just just use the params passed into the function?

  @ViewChild('subject', {static: true}) subjectInputRef!: ElementRef;
  @ViewChild('message', {static: true}) messageInputRef!: ElementRef;
  currentSender: string = 'Matthew';
  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage(subject: HTMLInputElement, msgText: HTMLInputElement) {
    const sub = this.subjectInputRef.nativeElement.value;
    const msg = this.messageInputRef.nativeElement.value;
    const newMessage = new Message('1000', sub, msg, this.currentSender);
    this.addMessageEvent.emit(newMessage);
    this.onClear();
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.messageInputRef.nativeElement.value = '';
  }

}
