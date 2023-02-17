import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizerService } from 'src/services/organizer.service';
import { UserService } from 'src/services/user.service';
import { User } from '../models/user';
import { Workshop } from '../models/workshop';

@Component({
  selector: 'app-add-workshop',
  templateUrl: './add-workshop.component.html',
  styleUrls: ['./add-workshop.component.css']
})
export class AddWorkshopComponent implements OnInit {

  constructor(private router: Router, private organizerService: OrganizerService, private userService: UserService) { }
  ngOnInit(): void {
    this.currUser = JSON.parse(localStorage.getItem("currentUser"));
    this.userService.getUserData(this.currUser.username).subscribe((user: User) => {
      this.currUser = user;//da l dodati ovo sad u localStorage
    });
    this.organizerService.getNamesOfTemplates(this.currUser.username).subscribe((t: string[]) => {
      this.workshopTemplates = t;
    })

  }

  currUser: User;

  name: string = "";
  date: Date = null;
  place: string = "";
  shortDesc: string = "";
  longDesc: string = "";
  mainPhoto: any = "";
  gallery = [];
  numOfPlaces: number = 0;
  organizer: string = "";
  status: string = "pending";

  workshopTemplates: string[] = [];
  templateName: string = "";

  errorMessage: string = "";



  addWorkshop() {
    console.log("main: ", this.mainPhoto)
    console.log("gallery: ", this.gallery)
    if (this.name == "") {
      this.errorMessage = "Error: Please provide a valid workshop name."
      return;
    }
    if (this.date == null) {
      this.errorMessage = "Error: Please provide a valid workshop date and time."
      return;
    }
    if (this.place == "") {
      this.errorMessage = "Error: Please provide a valid workshop place of happening."
      return;
    }
    if (this.shortDesc == "") {
      this.errorMessage = "Error: Please provide a short description of workshop."
      return;
    }
    if (this.longDesc == "") {
      this.errorMessage = "Error: Please provide a long description of workshop."
      return;
    }
    if (this.mainPhoto == "") {
      this.errorMessage = "Error: Please provide a main workshop photo."
      return;
    }
    if (this.gallery.length == 0) {
      this.errorMessage = "Error: Please provide a minimum of 1 picture for gallery."
      return;
    }
    if (this.numOfPlaces == 0) {
      this.errorMessage = "Error: Please provide a valid number of places available."
      return;
    }
    this.errorMessage = "";

    this.organizerService.addWorkshop(this.name, this.date, this.place, this.shortDesc, this.longDesc
      , this.mainPhoto, this.gallery, this.numOfPlaces, this.currUser.username, this.status).subscribe((resp) => {
        if (resp["resp"] == "OK") alert("The new workshop was added successfully!")
        this.router.navigate(["/myWorkshops"]);
      })

  }

  onFileChange(event) {

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {

        let img: any;
        this.mainPhoto = reader.result;

      };

    }
    else {
      this.mainPhoto = "";
    }
  }

  async onFileChangeMultiple(event) {
    if (this.gallery.length > 0) {
      this.gallery = [];
    }

    if (event.target.files && event.target.files.length) {
      const files = event.target.files;

      if (files.length > 5) {
        this.errorMessage = "Error: Maximum number of photos for gallery is 5."
        return
      }
      this.errorMessage = "";

      const reader = new FileReader();
      for (let i = 0; i < files.length; i++) {


        await new Promise<void>((resolve) => {
          reader.onload = () => {
            resolve();
          };
          reader.readAsDataURL(files[i]);
        });
        this.gallery.push(reader.result as string);
      }
    }
    else {
      this.gallery = [];
    }

    console.log(this.gallery)
  }



  clearCashWorkshop() {
    this.name = this.place = this.shortDesc = this.mainPhoto = this.organizer = this.longDesc = "";
    this.numOfPlaces = 0;
    this.date = null;
    this.gallery = [];
  }

  getTemplateData() {
    this.organizerService.getTemplateData(this.currUser.username, this.templateName).subscribe((template: Workshop) => {
      if (template) {
        this.name = template.name
        this.place = template.place
        this.shortDesc = template.shortDesc
        this.longDesc = template.longDesc
        this.mainPhoto = template.mainPhoto
        this.gallery = template.gallery
        this.numOfPlaces = template.numOfPlaces
      }
      else {
        alert("Error getting template with this name.")
      }
    })
  }

  getTemplate() {

    if (this.templateName == "") {
      this.clearCashWorkshop()
    }
    else {
      this.getTemplateData();
    }
  }




  logOut() {
    localStorage.removeItem("currentUser");
    this.currUser = null;
    this.router.navigate([""]);
  }

}
