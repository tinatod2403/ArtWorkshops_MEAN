import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/services/login.service';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"))
  }

  currentUser: User;


  firstname: string = "";
  lastname: string = "";
  username: string = "";
  password: string = "";
  passwordConfirm: string = "";
  phone: string = "";
  email: string = "";
  errorMessage: string = "";
  picture: any = "../../assets/avatar.jpg";

  isOrganizer: boolean = false;
  organizationName: string = "";
  oAddress: string = "";
  IDorganization: string = "";

  status: string = "pending";

  isAdmin: boolean = false;


  register(): void {
    let error: Boolean = this.checkInput();

    if (this.isAdmin) this.status = "approved"


    if (!error) {
      this.errorMessage = "";

      this.loginService.register(this.firstname, this.lastname, this.username, this.password,
        this.phone, this.email, this.picture, this.isOrganizer, this.organizationName, this.oAddress,
        this.IDorganization, this.status).subscribe((resp) => {

          if (resp['resp'] == 'OK') {
            alert('Registration is successful! Please wait for approval.')
            if (!this.isAdmin) this.router.navigate(["/login"]);
            if (this.isAdmin) this.router.navigate(['admin']);
          }
          else
            if (resp['resp'] == 'username') this.errorMessage = "User with this username alreay exists.";
            else
              if (resp['resp'] == 'email') this.errorMessage = "User with this email alreay exists."
        })

    }
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
            this.picture = "../../assets/avatar.jpg";
            this.errorMessage = "Image must be between 100x100 and 300x300 pixels"
          }
          else {
            this.picture = reader.result;
            this.errorMessage = ""
          }
        };

      };

    }
  }

  checkInput(): Boolean {
    if (this.username.length == 0) {
      this.errorMessage = "Error: Please enter Username to register."
      return true;
    }
    if (this.firstname.length == 0) {
      this.errorMessage = "Error: Please enter Firstname to register."
      return true;
    }
    if (this.lastname.length == 0) {
      this.errorMessage = "Error: Please enter Lastname to register."
      return true;
    }
    if (this.password.length == 0) {
      this.errorMessage = "Error: Please enter Password to register."
      return true;
    }
    if (this.passwordConfirm.length == 0) {
      this.errorMessage = "Error: Please reenter Password to register."
      return true;
    }
    if (this.phone.length == 0) {
      this.errorMessage = "Error: Please enter Phone number to register."
      return true;
    }
    if (this.email.length == 0) {
      this.errorMessage = "Error: Please enter Email to register."
      return true;
    }
    const passwordRegex = /^[a-z](?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,15}$/;
    if (!passwordRegex.test(this.password)) {
      this.errorMessage = "Error: Password not in right format."
      return true;
    }
    if (!(this.password === this.passwordConfirm)) {
      this.errorMessage = "Error: Passwords do not match."
      return true;
    }
    const phoneRegex = /^\+\d{10,12}$/;
    if (!phoneRegex.test(this.phone)) {
      this.errorMessage = "Error: Phone not in right format."
      return true;
    }
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9]*(?:[.][a-zA-Z0-9]+)*@gmail\.com$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = "Error: Email not in right format."
      return true;
    }

    return false;
  }


  logOut() {
    localStorage.removeItem("currentUser")
    this.router.navigate(["adminLogin"])
  }


  adminRegister() {
    this.isAdmin = true;
    this.register()
  }

}
