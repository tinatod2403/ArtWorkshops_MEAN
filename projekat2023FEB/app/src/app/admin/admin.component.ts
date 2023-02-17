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
    localStorage.removeItem("currentUser")
    this.currAdmin = JSON.parse(localStorage.getItem("adminUser"));
    this.adminService.getRegistrationRequests().subscribe((req: User[]) => {
      if (req) {
        this.registrationMessage = ""
        this.registrationRequests = req;
        console.log("registrationRequests: ", this.registrationRequests)
      }
      else {
        this.registrationMessage = "No registration requests."
      }
    })
    this.adminService.getWorkshopPropositions().subscribe((prop: Workshop[]) => {
      if (prop) {
        this.workshopPropMessage = ""
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

    this.adminService.getAllUsers().subscribe((u: User[]) => {
      if (u) {
        this.allUsersMessage = ""
        this.allUsers = u;
        console.log("allUsers ", this.allUsers)

        this.adminService.getAllOrganizers().subscribe((o: User[]) => {
          if (o) {
            this.allOrganizersMessage = ""
            this.allOrganizers = o;
            console.log("allOrganizers ", this.allOrganizers)
          }
          else {
            this.allOrganizersMessage = "No organizers."
          }
        })

      }
      else {
        this.allUsersMessage = "No users."

        this.adminService.getAllOrganizers().subscribe((o: User[]) => {
          if (o) {
            this.allOrganizersMessage = ""
            this.allOrganizers = o;
            console.log("allOrganizers ", this.allOrganizers)
          } else {
            this.allOrganizersMessage = "No organizers."
          }
        })


      }
    })


    this.adminService.getAllWorkshops().subscribe((w: Workshop[]) => {
      if (w) {
        this.allWorkshop = w;
        console.log("allWorkshop ", this.allWorkshop)
      }
    })
  }

  currAdmin: User;
  registrationRequests: User[] = [];
  workshopPropositions: Workshop[] = [];


  registrationMessage: string = "";
  workshopPropMessage: string = "";
  allUsersMessage: string = "";
  allOrganizersMessage: string = "";

  allUsers: User[] = [];
  allOrganizers: User[] = [];
  allWorkshop: Workshop[] = [];

  logOut() {
    localStorage.removeItem("adminUser")
    this.router.navigate(["adminLogin"])
  }


  public showPassword = false;

  public togglePassword(): void {
    this.showPassword = !this.showPassword;
  }


}
