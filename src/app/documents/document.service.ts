import { EventEmitter, Injectable, ɵɵsetComponentScope } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

import { Document } from './document.model';
// import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { stringify } from 'querystring';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  documents: Document[] = [];
  documentSelectEvent = new EventEmitter<Document>();
  // documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.documents = this.getDocuments();
    this.maxDocumentId = this.getMaxId();
  }

  sortAndSend() {
    const docListClone = this.documents.slice();
    this.documentListChangedEvent.next(docListClone);
  }

  getMaxId(): number {
    let maxId: number = 0;
    const numArr = this.documents.map(doc => parseInt(doc.id));
    maxId = Math.max(...numArr);
    return maxId;
  }

  addDocument(newDocument: Document): void {
    if (!newDocument) return
    newDocument.id = ''
    
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to db
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents', newDocument, { headers: headers })
      .subscribe(responseData => {
        // add new document to doucments
        this.documents.push(responseData.document);
        this.sortAndSend();
      })

    // this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) return
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) return
    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id, newDocument, { headers: headers })
      .subscribe((response: Response) => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      })

    // this.storeDocuments();
  }

  getDocuments() {
    // return this.documents.slice();
    this.http.get<Document[]>('http://localhost:3000/documents')
      .pipe(map(documents => {
        const docs = documents['documents'];
        return docs.map(document => {
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

    // delete from db
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe((response: Response) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      })
    
    // this.storeDocuments();
  }

  storeDocuments() {
    const docString: string = JSON.stringify(this.documents);
    this.http.put('https://wdd430-cms-3f0cd-default-rtdb.firebaseio.com/documents.json', docString)
      .subscribe(updatedDocArr => {
        this.documentListChangedEvent.next(this.documents.slice())
      })
  }
}
