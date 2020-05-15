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
  // , email:2, message:3
  constructor() {}

  ngOnInit() {}

  processForm() {
  
    const allInfo = `My name is ${this.name}. My email is ${this.email}. My message is ${this.message}`;
    alert(allInfo); 
    
    var data = [{name: "hi"}];
    
    var obj={name: this.name};
    data.push(obj);
   
//   //   const writeJsonFile = require('write-json-file');
//   //  var json = JSON.stringify(data);
//   //  alert(json);
//   // //  writeJsonFile.sync('contact-us.json', json, err => { 
     
//   // // Checking for errors 
//   // if (err) throw err;  
 
//   console.log("Done writing"); // Success 
// }); 
  }
}
