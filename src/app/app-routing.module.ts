import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; //CLI imports router


import { CountryListComponent } from './country-list/country-list.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [
   {path:'', component : CountryListComponent},
   {path:'contact-us', component : ContactUsComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [CountryListComponent,ContactUsComponent]

