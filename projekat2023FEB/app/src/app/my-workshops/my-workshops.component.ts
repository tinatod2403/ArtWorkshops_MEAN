import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizerService } from 'src/services/organizer.service';
import { UserService } from 'src/services/user.service';
import { SignUps } from '../models/signUps';
import { User } from '../models/user';
import { Workshop } from '../models/workshop';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-my-workshops',
  templateUrl: './my-workshops.component.html',
  styleUrls: ['./my-workshops.component.css']
})
export class MyWorkshopsComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef, private router: Router, private organizerService: OrganizerService, private userService: UserService) { }
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.userService.getUserData(this.currentUser.username).subscribe((user: User) => {
      this.currentUser = user;
    });

    if (this.currentUser.isOrganizer) {//ZA ORGANIZATORA
      this.organizerService.getMyWorkshops(this.currentUser.username).subscribe((workshops: Workshop[]) => {
        if (workshops.length > 0) {
          this.myWorkshops = workshops;
          this.informMessage = ""
          this.myWorkshops.forEach(w => {
            w.date = new Date(w.date).toLocaleString('en-US');
          })
        }
        else this.informMessage = "You don't have any workshops."
      })
      this.reloadSignUps();
    }
    else  //ZA USERA
      this.userService.getUserRegistWorkshops(this.currentUser.username).subscribe((signUps: SignUps[]) => {
        if (signUps.length > 0) {
          console.log("sign ups: ", signUps)
          this.mySignUpsWorkshops = signUps;
          this.informMessage = ""
          this.mySignUpsWorkshops.forEach(w => {
            w.workshopDate = new Date(w.workshopDate).toLocaleString('en-US');
            w.signUpDate = new Date(w.signUpDate).toLocaleString('en-US');
          })
        }
        else this.informMessage = "You didn't sign up for any workshops."
      })

  }
  withdrawRequest(event) {
    event.stopPropagation();
    let result = confirm("Are you sure you want to withdraw application?");
    if (result) {
      // Perform the action for yes and ad for 12h!!!
    } else {
      // Perform the action for no
    }
  }



  currentUser: User;
  myWorkshops: Workshop[] = [];
  mySignUpsWorkshops: SignUps[] = [];
  allSignUps: SignUps
  informMessage: string = "";
  errorMessage: string = "";

  reloadSignUps() {
    this.organizerService.getSignUpRequests(this.currentUser.username).subscribe((signUps: SignUps[]) => {
      console.log("signUp ", signUps);
      if (signUps.length > 0) {
        this.mySignUpsWorkshops = signUps;
      }
    })
  }

  acceptRequest(username, idWorkshop) {
    this.organizerService.acceptRequestForWorkshop(username, idWorkshop).subscribe((resp) => {
      if (resp["resp"] == "OK") {
        this.reloadSignUps();

      }
      else {
        this.errorMessage = "Error occurred accepting request."
      }
    })

  }

  // denyRequest() {

  // }

  requestsEmpty(id): boolean {
    let signUp = this.mySignUpsWorkshops.filter(s => s.idWorkshop == id)
    if (signUp.length == 0) return true;
    return false;
  }
  activeDate(id): boolean {

    let workshop = this.myWorkshops.filter(s => s._id == id)
    // console.log("pisao: ", workshop[0].date, "prebacio u: ", new Date(workshop[0].date))
    if (new Date(workshop[0].date) < new Date) return false;
    return true;
  }

  goToDetails(id) {
    localStorage.setItem("workshopID", JSON.stringify(id));
    this.router.navigate(["/workshopDetails"]);
  }



  deleteWorkshop(event, workshop) {
    event.stopPropagation();
    let result = confirm("Are you sure you want to cancle workshop?");
    if (result) {
      this.organizerService.cancelWorkshop(workshop._id).subscribe((resp) => {
        if (resp["resp"] == "OK") {
          alert("poslat mail")
        }
      })

    }
  }

  logOut() {
    localStorage.removeItem("currentUser");
    this.currentUser = null;
    this.router.navigate([""]);
  }

}




