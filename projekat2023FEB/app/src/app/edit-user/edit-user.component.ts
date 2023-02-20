import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/services/login.service';
import { OrganizerService } from 'src/services/organizer.service';
import { UserService } from 'src/services/user.service';
import { SignUps } from '../models/signUps';
import { User } from '../models/user';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  constructor(private organizerService: OrganizerService, private router: Router,
    private ls: LoginService, private userService: UserService) { }
  ngOnInit(): void {
    this.currentUser=JSON.parse(localStorage.getItem("currentUser"));
    this.currentUserEditing = JSON.parse(localStorage.getItem("currentUserEditing"));
    // alert(this.currentUser.isAdmin)
    this.userService.getUserData(this.currentUserEditing.username).subscribe((user: User) => {
      this.currentUserEditing = user;
    });
  }



  currentUser: User;
  currentUserEditing: User;
  firstnameEdit: string = "";
  lastnameEdit: string = "";
  usernameEdit: string = "";
  passwordEdit: string = "";
  phoneEdit: string = "";
  emailEdit: string = "";
  pictureEdit: any = "../../assets/avatar.jpg";

  passwordNew: string = "";
  passwordNewAgain: string = "";
  errorMessage: string = "";

  pastSignUps: SignUps[] = [];
  informMessage: string = "";

  public edit: string = "";


  editData(currEditing: string) {
    this.edit = currEditing;
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
      if (this.currentUserEditing.password != this.passwordEdit) {
        this.errorMessage = "Error: Wrong old password."
        return;
      }
    }



    this.userService.editData(newData, currEditing,
      this.currentUserEditing.username).subscribe((resp) => {
        if (resp['resp'] == "OK") {
          // alert("Succesfull editing");
        }


      })


    this.userService.getUserData(this.currentUserEditing.username).subscribe((user: User) => {
      if (user) {
        this.currentUserEditing = user;
      }
    })
    localStorage.setItem("currentUser", JSON.stringify(this.currentUserEditing))

    this.errorMessage = "";
    this.edit = "";
  }

  cancelEditing() {
    this.errorMessage = "";
    this.edit = "";
  }

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {

        let img: any;
        img = reader.result;

        const image = new Image();
        image.src = img;
        image.onload = () => {
          if (image.width < 100 || image.width > 300 || image.height < 100 || image.height > 300) {
            this.pictureEdit = "../../assets/avatar.jpg";
            this.errorMessage = "Image must be between 100x100 and 300x300 pixels"
          }
          else {
            this.pictureEdit = reader.result;
            this.errorMessage = ""
          }
        };

      };

    }
  }

  logOut() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentUserEditing");
    this.currentUser = null;
    this.router.navigate(["adminLogin"]);
  }

}
