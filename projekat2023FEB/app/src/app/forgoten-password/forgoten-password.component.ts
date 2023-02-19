import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-forgoten-password',
  templateUrl: './forgoten-password.component.html',
  styleUrls: ['./forgoten-password.component.css']
})
export class ForgotenPasswordComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  email: string = ""
  errorMessage: string = ""


  getRandomPass() {
    this.errorMessage = "";
    if (this.email == "") {
      this.errorMessage = "Error: You must type in email adress.";
      return
    }
    this.userService.generateNewPassword(this.email).subscribe((resp) => {
      if (resp["resp"] == "OK") {
        alert("email with new password has been sent to: " + this.email)
        this.errorMessage = "";
        this.router.navigate(['login'])
      }
      if (resp["resp"] == "noUser") {
        this.errorMessage = "Error: No user with this email exists: " + this.email;
      }
    })

  }

}
