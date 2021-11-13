import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  documents: Document[] = [];
  documentSelectEvent = new EventEmitter<Document>();
  // documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId: number = 0;
    const numArr = this.documents.map(doc => parseInt(doc.id));
    maxId = Math.max(...numArr);
    return maxId;
  }

  addDocument(newDocument: Document): void {
    if (!newDocument) return
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    
    this.documents.push(newDocument);

    // const docListClone = this.documents.slice();
    // this.documentListChangedEvent.next(docListClone);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument) return
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) return
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;

    // const docListClone = this.documents.slice();
    // this.documentListChangedEvent.next(docListClone);
    this.storeDocuments();
  }

  getDocuments() {
    // return this.documents.slice();
    this.http.get<Document[]>('https://wdd430-cms-3f0cd-default-rtdb.firebaseio.com/documents.json')
      .pipe(map(documents => {
        return documents.map(document => {
          return {
            ...document,
            children: document.children ? document.children : []
          }
        })
      }))
      .subscribe((documents: Document[]) => {
        // success method
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        });
        this.documentListChangedEvent.next(this.documents.slice());

      }, (error: any) => console.log(error));

      return this.documents;

  }

  getDocument(id: string): Document {
    return this.documents.find(document => document.id === id ? document : null);
  }

  deleteDocument(document: Document) {
    if (!document) return;
    const pos = this.documents.indexOf(document);
    if (pos < 0) return;
    
    this.documents.splice(pos, 1);
    // this.documentChangedEvent.emit(this.documents.slice());
    // this.documentListChangedEvent.next(this.documents.slice());
    this.storeDocuments();
  }

  storeDocuments() {
    const docString: string = JSON.stringify(this.documents);
    this.http.put('https://wdd430-cms-3f0cd-default-rtdb.firebaseio.com/documents.json', docString)
      .subscribe(updatedDocArr => {
        this.documentListChangedEvent.next(this.documents.slice())
      })
  }
}
