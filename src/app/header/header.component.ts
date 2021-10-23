import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cms-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title = 'WeLearn CMS'

  constructor() { }

  ngOnInit(): void {
  }

}
