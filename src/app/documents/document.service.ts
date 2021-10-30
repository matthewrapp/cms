import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  documents: Document[] = [];
  documentSelectEvent = new EventEmitter<Document>();
  // documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor() {
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

    const docListClone = this.documents.slice();
    this.documentListChangedEvent.next(docListClone);
  }

  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument) return
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) return
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;

    const docListClone = this.documents.slice();
    this.documentListChangedEvent.next(docListClone);
  }

  getDocuments() {
    return this.documents.slice();
  }

  getDocument(id: string) {
    return this.documents.find(document => document.id === id ? document : null);
  }

  deleteDocument(document: Document) {
    if (!document) return;
    const pos = this.documents.indexOf(document);
    if (pos < 0) return;
    
    this.documents.splice(pos, 1);
    // this.documentChangedEvent.emit(this.documents.slice());
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
