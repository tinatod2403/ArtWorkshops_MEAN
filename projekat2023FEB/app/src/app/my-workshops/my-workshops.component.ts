import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizerService } from 'src/services/organizer.service';
import { UserService } from 'src/services/user.service';
import { SignUps } from '../models/signUps';
import { User } from '../models/user';
import { Workshop } from '../models/workshop';

@Component({
  selector: 'app-my-workshops',
  templateUrl: './my-workshops.component.html',
  styleUrls: ['./my-workshops.component.css']
})
export class MyWorkshopsComponent implements OnInit {

  constructor(private router: Router, private organizerService: OrganizerService, private userService: UserService) { }
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.userService.getUserData(this.currentUser.username).subscribe((user: User) => {
      this.currentUser = user;
    });

    if (this.currentUser.isOrganizer) //ZA ORGANIZATORA
      this.organizerService.getMyWorkshops(this.currentUser.username).subscribe((workshops: Workshop[]) => {
        if (workshops.length > 0) {
          this.myWorkshops = workshops;
          this.informMessage = ""
          this.myWorkshops.forEach(w => {
            w.date = new Date(w.date).toLocaleString('sr-RS');
          })
        }
        else this.informMessage = "You don't have any workshops."
      })
    else  //ZA USERA
      this.userService.getUserRegistWorkshops(this.currentUser.username).subscribe((signUps: SignUps[]) => {
        if (signUps.length > 0) {
          console.log("sign ups: ", signUps)
          this.mySignUpsWorkshops = signUps;
          this.informMessage = ""
          this.mySignUpsWorkshops.forEach(w => {
            w.workshopDate = new Date(w.workshopDate).toLocaleString('sr-RS');
            w.signUpDate = new Date(w.signUpDate).toLocaleString('sr-RS');
          })
        }
        else this.informMessage = "You didn't sign up for any workshops."
      })

  }
  withdraw(event) {
    event.stopPropagation();
    let result = confirm("Are you sure you want to cancel application?");
    if (result) {
      // Perform the action for yes and ad for 12h!!!
    } else {
      // Perform the action for no
    }
  }

  currentUser: User;
  myWorkshops: Workshop[] = [];
  mySignUpsWorkshops: SignUps[] = [];
  informMessage: string = "";
  errorMessage: string = "";

  goToDetails(id) {
    localStorage.setItem("workshopID", JSON.stringify(id));
    this.router.navigate(["/workshopDetails"]);
  }

  logOut() {
    localStorage.removeItem("currentUser");
    this.currentUser = null;
    this.router.navigate([""]);
  }

}




