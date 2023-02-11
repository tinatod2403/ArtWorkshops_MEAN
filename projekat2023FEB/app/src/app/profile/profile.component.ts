import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/services/login.service';
import { UserService } from 'src/services/user.service';
import { SignUps } from '../models/signUps';
import { User } from '../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router, private ls: LoginService, private userService: UserService) { }

  public edit: string = "";

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.userService.getUserData(this.currentUser.username).subscribe((user: User) => {
      this.currentUser = user;
    });

    this.userService.getPassedWorkshops(this.currentUser.username).subscribe((signUps: SignUps[]) => {
      if (signUps.length > 0) {
        this.pastSignUps = signUps;
        console.log("Passed", signUps)

        this.pastSignUps.forEach(w => {
          w.workshopDate = new Date(w.workshopDate).toLocaleString('en-US');
          w.signUpDate = new Date(w.signUpDate).toLocaleString('en-US');
        })
      }
      else {
        this.informMessage = "You haven't been to any workshops yet."
      }
    })

  }

  currentUser: User;
  firstnameEdit: string = "";
  lastnameEdit: string = "";
  usernameEdit: string = "";
  passwordEdit: string = "";
  phoneEdit: string = "";
  emailEdit: string = "";

  passwordNew: string = "";
  passwordNewAgain: string = "";
  errorMessage: string = "";

  pastSignUps: SignUps[] = [];
  informMessage: string = "";

  editData(currEditing: string) {
    this.edit = currEditing;
  }
  cancelEditing() {
    this.errorMessage = "";
    this.edit = "";
  }

  doneEditing(newData: string, currEditing: string) {
    console.log('newData ', newData)
    console.log('currEditing ', currEditing)

    if (currEditing == "password") {
      console.log("this.passwordEdit: ", this.passwordEdit)
      if (this.passwordEdit == "" || this.passwordNew == "" || this.passwordNewAgain == "") {

        this.errorMessage = "Error: You must fill in all fields before changing password.";
        return;
      }
      const passwordRegex = /^[a-z](?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,15}$/;
      if (!passwordRegex.test(this.passwordNew)) {
        this.errorMessage = "Error: Password not in right format."
        return;
      }
      if (this.passwordNew != this.passwordNewAgain) {
        this.errorMessage = "Error: Passwords do not match."
        return;
      }
      if (this.currentUser.password != this.passwordEdit) {
        this.errorMessage = "Error: Wrong old password."
        return;
      }
    }

    this.userService.editData(newData, currEditing,
      this.currentUser.username).subscribe((resp) => {
        // if (resp['resp'] == 'username exists') {
        //   this.errorMessage = "Error: User with this username already exists."
        //   return;
        // }
        // if (resp['resp'] == 'email exists') {
        //   this.errorMessage = "Error: User with this email already exists."
        //   return;
        // }
        if (resp['resp'] == "OK") {
          return;
        }


      })


    this.userService.getUserData(this.currentUser.username).subscribe((user: User) => {
      if (user) {
        this.currentUser = user;
      }
    })
    this.errorMessage = "";
    this.edit = "";
  }

  sortName() {
    this.pastSignUps.sort((a, b) => {
      if (a.nameWorkshop < b.nameWorkshop) return 1;
      if (a.nameWorkshop > b.nameWorkshop) return -1;
      return 0;
    })
  }

  sortDate() {
    this.pastSignUps.sort((a, b) => {
      if (new Date(a.workshopDate) > new Date(b.workshopDate)) return 1;
      if (new Date(a.workshopDate) < new Date(b.workshopDate)) return -1;
      return 0;
    })
  }

  sortTimeStamp() {
    this.pastSignUps.sort((a, b) => {
      if (new Date(a.signUpDate) > new Date(b.signUpDate)) return 1;
      if (new Date(a.signUpDate) < new Date(b.signUpDate)) return -1;
      return 0;
    })
  }

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  logOut() {
    localStorage.removeItem("currentUser");
    this.currentUser = null;
    this.router.navigate([""]);
  }

}
