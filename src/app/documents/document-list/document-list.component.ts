import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = [
    new Document('1', 'Doc Name #1', 'Document description goes here', 'https://documentURL.com', null),
    new Document('2', 'Doc Name #2', 'Document description goes here', 'https://documentURL.com', null),
    new Document('3', 'Doc Name #3', 'Document description goes here', 'https://documentURL.com', null),
    new Document('4', 'Doc Name #4', 'Document description goes here', 'https://documentURL.com', null),
    new Document('5', 'Doc Name #5', 'Document description goes here', 'https://documentURL.com', null),
  ]
  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
