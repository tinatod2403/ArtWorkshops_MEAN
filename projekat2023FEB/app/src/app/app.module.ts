import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RegisterComponent } from './register/register.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OrganizerComponent } from './organizer/organizer.component';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './user/user.component';
import { ProfileComponent } from './profile/profile.component';
import { WorkshopsComponent } from './workshops/workshops.component';
import { BecomeOrganizerComponent } from './become-organizer/become-organizer.component';
import { MatTableModule } from '@angular/material/table';
import { AddWorkshopComponent } from './add-workshop/add-workshop.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MyWorkshopsComponent } from './my-workshops/my-workshops.component';
import { WorkshopDetailsComponent } from './workshop-details/workshop-details.component';
import { EditWorkshopComponent } from './edit-workshop/edit-workshop.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    HomeComponent,
    RegisterComponent,
    OrganizerComponent,
    UserComponent,
    ProfileComponent,
    WorkshopsComponent,
    BecomeOrganizerComponent,
    AddWorkshopComponent,
    MyWorkshopsComponent,
    WorkshopDetailsComponent,
    EditWorkshopComponent,
    AdminLoginComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    HttpClientModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

