import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizerService } from 'src/services/organizer.service';
import { UserService } from 'src/services/user.service';
import { User } from '../models/user';
import { Workshop } from '../models/workshop';

@Component({
  selector: 'app-edit-workshop',
  templateUrl: './edit-workshop.component.html',
  styleUrls: ['./edit-workshop.component.css']
})
export class EditWorkshopComponent implements OnInit {

  constructor(private router: Router, private organizerService: OrganizerService, private userService: UserService) { }



  ngOnInit(): void {

    let id = JSON.parse(localStorage.getItem("workshopID"));

    this.organizerService.workshopDetails(id).subscribe((workshop: Workshop) => {
      if (workshop) {
        this.currWorkshop = workshop;
        this.currWorkshop.date = new Date(this.currWorkshop.date).toLocaleString('en-US');
        this.nameEdit = this.currWorkshop.name;
        this.placeEdit = this.currWorkshop.place;
        this.shortDescEdit = this.currWorkshop.shortDesc;
        this.longDescEdit = this.currWorkshop.longDesc;
        this.numOfPlacesEdit = this.currWorkshop.numOfPlaces;
        this.mainPhotoEdit = this.currWorkshop.mainPhoto;
        this.galleryEdit = this.currWorkshop.gallery;
      }
      else {
        console.log("Error with getting workshop details.")
      }
    })

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.userService.getUserData(this.currentUser.username).subscribe((user: User) => {
      this.currentUser = user;
    });

  }

  currentUser: User;
  currWorkshop: Workshop;
  errorMessage: string;

  edit: string = "";


  nameEdit: string = "";
  dateEdit: string = "";
  placeEdit: string = "";
  shortDescEdit: string = "";
  longDescEdit: string = "";
  numOfPlacesEdit: Number = 0;
  mainPhotoEdit: any = "";
  galleryEdit: string[] = [];


  editData(currEditing: string) {
    this.edit = currEditing;
  }

  cancelEditing() {
    this.errorMessage = "";
    this.edit = "";
    this.galleryEdit = this.currWorkshop.gallery
  }

  toStr(newData: Number, currEditing: string) {
    let newData_ = newData.toString();
    this.doneEditing(newData_, currEditing)
  }

  doneEditing(newData, currEditing: string) {
    if (this.nameEdit == "" && currEditing == "name") {
      this.errorMessage = "Error: The name field cannot be empty."
      return;
    }
    if (this.dateEdit == "" && currEditing == "date") {
      this.errorMessage = "Error: The date field cannot be empty."
      return;
    }
    if (this.placeEdit == "" && currEditing == "place") {
      this.errorMessage = "Error: The place field cannot be empty."
      return;
    }
    if (this.shortDescEdit == "" && currEditing == "shortDesc") {
      this.errorMessage = "Error: The short description field cannot be empty."
      return;
    }
    if (this.longDescEdit == "" && currEditing == "longDesc") {
      this.errorMessage = "Error: The long description field cannot be empty."
      return;
    }
    if (this.numOfPlacesEdit <= 0 && currEditing == "numOfPlaces") {
      this.errorMessage = "Error: The number of places cannot be zero."
      return;
    }
    if (this.galleryEdit.length == 0 && currEditing == "gallery") {
      this.errorMessage = "Error: The number of pictures in gallery can't be zero."
      return;
    }

    this.organizerService.editWorkshopDetailes(newData, currEditing, this.currWorkshop._id).subscribe((resp) => {

      if (resp['resp'] == "OK") {

      }
      else {
        console.log("Error editing data.")
      }
    })

    this.organizerService.workshopDetails(this.currWorkshop._id).subscribe((workshop: Workshop) => {
      if (workshop) {
        // this.currWorkshop = workshop;
        // this.currWorkshop.date = new Date(this.currWorkshop.date).toLocaleString('en-US');
        // this.nameEdit = this.currWorkshop.name;
        // this.placeEdit = this.currWorkshop.place;
        // this.shortDescEdit = this.currWorkshop.shortDesc;
        // this.longDescEdit = this.currWorkshop.longDesc;
        // this.numOfPlacesEdit = this.currWorkshop.numOfPlaces;
        location.reload()
      }
      else {
        console.log("Error with getting workshop details after adding.")
      }
    })

    this.errorMessage = "";
    this.edit = "";

  }


  onFileChange(event) {

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {

        let img: any;
        this.mainPhotoEdit = reader.result;

      };

    }
    else {
      this.mainPhotoEdit = "";
    }
  }

  removePhoto(photo) {
    this.galleryEdit = this.galleryEdit.filter(p => p != photo)
  }

  doneEditingGallery(gallery, d) {

    // this.doneEditing(gallery, d)
  }

  async onFileChangeMultiple(event) {

    this.errorMessage = ""

    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      // alert(files.length + this.galleryEdit.length)
      if ((files.length + this.galleryEdit.length) > 5) {
        this.errorMessage = "Error: Maximum number of photos for gallery is 5."
        return
      }
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
        this.galleryEdit.push(reader.result as string);
      }
    }
    else {
      this.galleryEdit = [];
    }

    console.log(this.galleryEdit)
  }


  logOut() {
    localStorage.removeItem("currentUser");
    this.currentUser = null;
    this.router.navigate([""]);
  }

}
