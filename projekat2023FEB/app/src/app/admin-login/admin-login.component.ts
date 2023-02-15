import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/services/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(private router: Router, private adminService: AdminService) { }
  ngOnInit(): void {
    
  }

  username: string = "";
  password: String = "";
  errorMessage: String = "";


  logIn() {

    if (this.username.length == 0) {
      this.errorMessage = "Error: Please enter a username to log in."
      return
    }
    if (this.password.length == 0) {
      this.errorMessage = "Error: Please enter a password to log in."
      return
    }
    this.errorMessage = "";

    this.adminService.login(this.username, this.password).subscribe((admin) => {
      if (admin) {
        localStorage.setItem("adminUser", JSON.stringify(admin))
        this.router.navigate(["/admin"])
      }
      else {
        this.errorMessage = "Admin with this credentials doesn't exist."
        return
      }
    })


  }

}
