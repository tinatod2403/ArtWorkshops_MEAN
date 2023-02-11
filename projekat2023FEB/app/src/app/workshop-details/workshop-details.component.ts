import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizerService } from 'src/services/organizer.service';
import { UserService } from 'src/services/user.service';
import { User } from '../models/user';
import { Workshop } from '../models/workshop';

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.css']
})
export class WorkshopDetailsComponent implements OnInit {

  constructor(private router: Router, private organizerService: OrganizerService, private userService: UserService) { }
  ngOnInit(): void {

    let id = JSON.parse(localStorage.getItem("workshopID"));

    this.organizerService.workshopDetails(id).subscribe((workshop: Workshop) => {
      if (workshop) {
        this.currWorkshop = workshop;
        let date = new Date(workshop.date);
        this.dateAndTime = date.toLocaleDateString() + " " + date.toLocaleTimeString();
        this.imageDisplay = this.currWorkshop.gallery[0]
        console.log("mesta ", this.currWorkshop.numOfPlaces)

      }
      else {
        console.log("Error with getting workshop details.")
      }
    })

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.userService.getUserData(this.currentUser.username).subscribe((user: User) => {
      this.currentUser = user;
    });


  }

  currentUser: User;
  currWorkshop: Workshop;
  errorMessage: string;
  dateAndTime: any;
  iterator: number = 0;
  imageDisplay: string;
  mapUrl;

  signUp() {
    if (this.currWorkshop.numOfPlaces == 0) {
      this.errorMessage = "No more places available for this workshop"
      return;
    }
    this.userService.signUpForWorkshop(this.currentUser.username, this.currWorkshop._id, this.currWorkshop.organizer,
      this.currWorkshop.name, this.currentUser.picture, this.currWorkshop.mainPhoto, new Date(),
      new Date(this.currWorkshop.date), 'pending').subscribe((resp) => {
        if (resp["resp"] == "OK") {
          alert("You have successfully signed up for this workshop.")
        }
        else if (resp["resp"] == "exists") {
          this.errorMessage = "You already signed up for this workshop."
          return;
        }
        else {
          console.log("Neuspesno Signupovan")
        }
      })

  }

  cancelWorkshop(id) {
    let result = confirm("Are you sure you want to cancel this workshop?");
    if (result) {

    }
    else {

    }
  }

  editWorkshop(event, id) {
    event.stopPropagation()
    localStorage.setItem("workshopID", JSON.stringify(id));
    this.router.navigate(["/editWorkshop"]);
  }

  toNotify() {
    //TODO
  }

  previous() {

    this.iterator = (this.iterator - 1 + this.currWorkshop.gallery.length) % this.currWorkshop.gallery.length;
    console.log(this.iterator)
    this.imageDisplay = this.currWorkshop.gallery[this.iterator]
  }
  next() {
    this.iterator = (this.iterator + 1 + this.currWorkshop.gallery.length) % this.currWorkshop.gallery.length;
    this.imageDisplay = this.currWorkshop.gallery[this.iterator]
  }

  logOut() {
    localStorage.removeItem("currentUser");
    this.currentUser = null;
    this.router.navigate([""]);
  }

}
