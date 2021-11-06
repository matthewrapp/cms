import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDoc: Document;
  document: Document;
  editMode: boolean = false;

  constructor(private documentService: DocumentService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = +params['id'];
      if (!id) {
        this.editMode = false;
        return
      }
      // we in edit mode
      this.originalDoc = this.documentService.getDocument(id.toString());

      if (!this.originalDoc) return
      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDoc));

    })
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newDocId = this.documentService.getMaxId() + 1;
    const newDocument = new Document(newDocId.toString(), value.name, value.description, value.url, null);

    if (this.editMode) {
      this.documentService.updateDocument(this.originalDoc, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }

}
