import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/services/admin.service';
import { User } from '../models/user';
import { Workshop } from '../models/workshop';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit(): void {
    this.currAdmin = JSON.parse(localStorage.getItem("adminUser"));
    this.adminService.getRegistrationRequests().subscribe((req: User[]) => {
      if (req) {
        this.registrationRequests = req;
        console.log("registrationRequests: ", this.registrationRequests)
      }
      else {
        this.registrationMessage = "No registration requests."
      }
    })
    this.adminService.getWorkshopPropositions().subscribe((prop: Workshop[]) => {
      if (prop) {
        this.workshopPropositions = prop;
        this.workshopPropositions.forEach(w => {
          w.date = (new Date(w.date)).toLocaleString('en-US')
        })
        console.log("workshopPropositions ", this.workshopPropositions)
      }
      else {
        this.workshopPropMessage = "No workshop propositions."
      }
    })
  }

  currAdmin: User;
  registrationRequests: User[] = [];
  workshopPropositions: Workshop[] = [];


  registrationMessage: string = "";
  workshopPropMessage: string = "";

  logOut() {
    localStorage.removeItem("adminUser")
    this.router.navigate(["adminLogin"])

  }





}
