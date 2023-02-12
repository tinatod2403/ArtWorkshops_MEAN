import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizerService } from 'src/services/organizer.service';
import { UserService } from 'src/services/user.service';
import { User } from '../models/user';
import { Workshop } from '../models/workshop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private organizerService: OrganizerService,
    private userService: UserService) { }

  ngOnInit(): void {

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.userService.getAllActiveWorkshops().subscribe((workshops: Workshop[]) => {
      if (workshops) {
        this.allWorkshops = workshops;
        console.log("All workshops", this.allWorkshops)
        this.setDateFormat()
      }
    })

    // console.log("All workshops", this.allWorkshops)
  }

  currentUser: User;
  allWorkshops: Workshop[] = [];
  searchValue: string = "";
  searchValueDisplay = "";

  searchWorkshops() {
    console.log(this.searchValue)
    this.userService.searchWorkshops(this.searchValue).subscribe((workshops: Workshop[]) => {
      if (workshops) {
        this.allWorkshops = workshops;
        this.setDateFormat()
        this.searchValueDisplay = this.searchValue;
        this.searchValue = ""
      }

    })
  }

  editWorkshop(event, id) {
    event.stopPropagation()
    localStorage.setItem("workshopID", JSON.stringify(id));
    this.router.navigate(["/editWorkshop"]);
  }

  setDateFormat() {
    this.allWorkshops.forEach(w => {
      w.date = new Date(w.date).toLocaleString('en-US');
    })
  }

  sortName() {
    this.allWorkshops.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    })

  }

  sortDate(type) {
    if (type == "asc") {
      this.allWorkshops.sort((a, b) => {
        if (new Date(a.date) < new Date(b.date)) return -1;
        if (new Date(a.date) > new Date(b.date)) return 1;
        return 0;
      })
    }
    else {
      this.allWorkshops.sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;
        return 0;
      })
    }

  }

  goToDetails(id) {
    localStorage.setItem("workshopID", JSON.stringify(id));
    this.router.navigate(["/workshopDetails"]);
  }

  goToLogin() {
    this.router.navigate(["login"]);
  }

  logOut() {
    localStorage.removeItem("currentUser");
    this.currentUser = null;
    this.router.navigate([""]);
  }



}
