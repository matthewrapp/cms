import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({ providedIn: 'root' })
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  // contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId: number = 0;
    const numArr = this.contacts.map(contact => parseInt(contact.id));
    maxId = Math.max(...numArr);
    return maxId;
  }

  addContact(newContact: Contact): void {
    if (!newContact) return
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();

    this.contacts.push(newContact);

    // const contactListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactListClone);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact) return
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) return
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;

    // const contactListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactListClone);
    this.storeContacts();
  }

  getContacts() {
    // return this.contacts.slice();
    this.http.get<Contact[]>('https://wdd430-cms-3f0cd-default-rtdb.firebaseio.com/contacts.json')
      .pipe(map(contacts => {
        return contacts.map(contact => {
          return {
            ...contact,
            group: contact.group ? contact.group : []
          }
        })
      }))
      .subscribe((contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        });
        this.contactListChangedEvent.next(this.contacts.slice());
      }, (error: any) => console.log(error))

      return this.contacts;
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
    // this.contactListChangedEvent.next(this.contacts.slice());
    this.storeContacts();
  }

  storeContacts() {
    const contactString = JSON.stringify(this.contacts);
    this.http.put('https://wdd430-cms-3f0cd-default-rtdb.firebaseio.com/contacts.json', contactString)
      .subscribe(updatedContactArr => {
        this.contactListChangedEvent.next(this.contacts.slice())
      })
  }

}
