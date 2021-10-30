import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({ providedIn: 'root' })
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  // contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId: number = 0;
    const numArr = this.contacts.map(contact => parseInt(contact.id));
    maxId = Math.max(...numArr);
    return maxId;
  }

  addDocument(newContact: Contact): void {
    if (!newContact) return
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();

    const contactListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactListClone);
  }

  updateDocument(originalContact: Contact, newContact: Contact): void {
    if (!originalContact) return
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) return
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;

    const contactListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactListClone);
  }

  getContacts() {
    return this.contacts.slice();
  }
  
  getContact(id: string) {
    return this.contacts.find(contact => contact.id === id ? contact : null);
  }

  deleteContact(contact: Contact) {
    if (!contact) return;
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;
    this.contacts.splice(pos, 1);
    // this.contactChangedEvent.emit(this.contacts.slice());
    this.contactListChangedEvent.next(this.contacts.slice());
  }

}
