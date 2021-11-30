import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

import { Contact } from './contact.model';
import { stringify } from 'querystring';
// import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({ providedIn: 'root' })
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  // contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor(private http: HttpClient) {
    // this.contacts = this.getContacts();
    this.getContacts();
    this.maxContactId = this.getMaxId();
  }

  sortAndSend() {
    const contactListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactListClone);
  }

  getMaxId(): number {
    let maxId: number = 0;
    const numArr = this.contacts.map(contact => parseInt(contact.id));
    maxId = Math.max(...numArr);
    return maxId;
  }

  addContact(newContact: Contact): void {
    if (!newContact) return

    newContact.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to db
    this.http.post<{message: string, contact: Contact}>('http://localhost:3000/contacts', newContact, {headers: headers})
      .subscribe(responseData => {
        this.contacts.push(responseData.contact);
        this.contacts.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        this.sortAndSend();
      })

    // this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) return
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) return
    newContact.id = originalContact.id;
    
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update db
    this.http.put('http://localhost:3000/contacts/' + originalContact.id, newContact, {headers: headers})
      .subscribe((response: Response) => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      })

    // this.storeContacts();
  }

  getContacts() {
    // return this.contacts.slice();
    this.http.get<{message: string, contacts: Contact[]}>('http://localhost:3000/contacts')
      // .pipe(map(contacts => {
      //   return contacts['contacts'].map(contact => {
      //     return {
      //       ...contact,
      //       group: contact.group ? contact.group : []
      //     }
      //   })
      // }))
      .subscribe(responseData => {
        this.contacts = responseData['contacts'];
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        });
        this.contactListChangedEvent.next(this.contacts.slice());
      }, (error: any) => console.log(error));
      
      return this.contacts;
  }
  
  getContact(id: string) {
    // need to build out a server call to get contact by object id
    // const c = this.contacts.find(contact => contact.id === id ? contact : null);
    for (let contact of this.contacts) {
      if (contact.id === id) return contact;
    }
    return null
    // return this.http.get<{message: stringify, contact: Contact}>('http://localhost:3000/contacts/'+ id);
    // return this.http.get<{message: string, contact: Contact}>('http://localhost:3000/contacts' + id);
  }

  deleteContact(contact: Contact) {
    if (!contact) return;
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;
    
    // delete from db
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe((response: Response) => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      })

    // this.storeContacts();
  }

  storeContacts() {
    const contactString = JSON.stringify(this.contacts);
    this.http.put('https://wdd430-cms-3f0cd-default-rtdb.firebaseio.com/contacts.json', contactString)
      .subscribe(updatedContactArr => {
        this.contactListChangedEvent.next(this.contacts.slice())
      })
  }

}
