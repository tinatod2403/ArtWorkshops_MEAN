import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddWorkshopComponent } from './add-workshop/add-workshop.component';
import { AdminComponent } from './admin/admin.component';
import { BecomeOrganizerComponent } from './become-organizer/become-organizer.component';
import { EditWorkshopComponent } from './edit-workshop/edit-workshop.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyWorkshopsComponent } from './my-workshops/my-workshops.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
import { WorkshopsComponent } from './workshops/workshops.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "profile", component: ProfileComponent },
  { path: "**/profile", component: ProfileComponent },
  { path: "workshops", component: WorkshopsComponent },
  { path: "**/workshops", component: WorkshopsComponent },
  { path: "becomeOrganizer", component: BecomeOrganizerComponent },
  { path: "**/becomeOrganizer", component: BecomeOrganizerComponent },
  { path: "login", component: LoginComponent },
  { path: "login/register", component: RegisterComponent },
  { path: "register", component: RegisterComponent },
  { path: "register/login", component: LoginComponent },
  { path: "**/home", component: HomeComponent },
  { path: "addWorkshop", component: AddWorkshopComponent },
  { path: "**/addWorkshop", component: AddWorkshopComponent },
  { path: "myWorkshops", component: MyWorkshopsComponent },
  { path: "**/myWorkshops", component: MyWorkshopsComponent },
  { path: "workshopDetails", component: WorkshopDetailsComponent },
  { path: "**/workshopDetails", component: WorkshopDetailsComponent },
  { path: "editWorkshop", component: EditWorkshopComponent },
  // { path: "**/editWorkshop", component: EditWorkshopComponent },

  { path: "admin", component: AdminComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
