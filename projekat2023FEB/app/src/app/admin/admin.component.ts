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
    this.currAdmin = JSON.parse(localStorage.getItem("currentUser"));
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
    localStorage.removeItem("currentUser")
    this.router.navigate(["adminLogin"])
  }


  public showPassword = false;

  public togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  oldPass: string = "";
  newPass: string = "";
  newPassAgain: string = "";
  errorMessagePass: string = "";

  changePass() {

    if (this.oldPass == "" || this.newPass == "" || this.newPassAgain == "") {
      this.errorMessagePass = "Error: All fields must be filled."
      return
    }
    if (this.oldPass != this.currAdmin.password) {
      this.errorMessagePass = "Error: Old password is not correct."
      return
    }
    if (this.newPass != this.newPassAgain) {
      this.errorMessagePass = "Error: New and confirm passwords do not match."
      return
    }
    const passwordRegex = /^[a-z](?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,15}$/;
    if (!passwordRegex.test(this.newPass)) {
      this.errorMessagePass = "Error: Password not in right format."
      return;
    }
    this.adminService.changePassword(this.currAdmin.username, this.newPass).subscribe((resp) => {
      if (resp["resp"] == "OK") {
        this.logOut()
      }
    })
    this.errorMessagePass = ""

  }


  approveUser(user) {
    console.log(user.username)
    this.adminService.updateStatus(user.username, 'approved').subscribe((resp) => {
      if (resp["resp"] == "OK") {
        location.reload()
      }
    })
  }

  denyUser(user) {

    this.adminService.updateStatus(user.username, 'denied').subscribe((resp) => {
      if (resp["resp"] == "OK") {
        location.reload()
      }
    })
  }

  approveWorkshop(workshop) {
    alert(workshop._id)
    this.adminService.approveWorkshop(workshop._id).subscribe((resp) => {
      if (resp["resp"] == "OK") {
        location.reload()
      }
    })
  }


  addNewUser() {
    this.router.navigate(['register'])
  }

  workshopOrganizer: string = "";
  errorMessage: string = ""

  addWorkshop() {
    if (this.workshopOrganizer == "") {
      this.errorMessage = "You mush chose organizer to add workshop."
      return
    }
    // alert(this.workshopOrganizer)
    localStorage.setItem("organizer", this.workshopOrganizer)
    this.router.navigate(['addWorkshop'])
  }

}
