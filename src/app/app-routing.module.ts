import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//basko
import { CountryListComponent } from './country-list/country-list.component';
 import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [
   {path:'', component : CountryListComponent},
   {path:'contact-us', component : ContactUsComponent}
];
// basko

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
//basko
export const routingComponents = [CountryListComponent,ContactUsComponent]
//basko
