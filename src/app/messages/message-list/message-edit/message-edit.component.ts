import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../../message.model';
import { MessageService } from '../../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subjectInputRef: ElementRef;
  @ViewChild('message') messageInputRef: ElementRef;
  // currentSender: string = '7';
  currentSender: Contact;

  constructor(private messageServive: MessageService, private contactService: ContactService) {
    // this.currentSender = Contact;
   }

  ngOnInit(): void {
    this.currentSender = this.contactService.getContact('110');
    this.contactService.getContact('110')
  }

  onSendMessage(subject: HTMLInputElement, msgText: HTMLInputElement) {
    const sub = this.subjectInputRef.nativeElement.value;
    const msg = this.messageInputRef.nativeElement.value;

    const newMessage = new Message('5', sub, msg, this.currentSender);
    this.messageServive.addMessage(newMessage);
    this.onClear();
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.messageInputRef.nativeElement.value = '';
  }

}
