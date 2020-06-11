import { Component, OnInit } from '@angular/core';

declare var require: any
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})

export class ContactUsComponent implements OnInit {
  name: string;
  email: string;
  message: string;
  constructor() {}

  ngOnInit() {}
}
