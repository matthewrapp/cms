import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  docListSubscription: Subscription;

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.documents = this.documentService.getDocuments();
    // this.documentService.documentChangedEvent.subscribe((documents: Document[]) => {
    //   this.documents = documents;
    // })
    this.docListSubscription = this.documentService.documentListChangedEvent.subscribe((docList: Document[]) => {
      this.documents = docList;
    })
  }

  ngOnDestroy(): void {
    this.docListSubscription.unsubscribe();
  }
}
