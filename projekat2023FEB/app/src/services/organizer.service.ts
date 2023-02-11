import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizerService {

  constructor(private http: HttpClient, private router: Router) { }

  private httpStr: string = "";
  url = 'http://localhost:4000';

  addWorkshop(name, date, place, shortDesc, longDesc, mainPhoto, gallery, numOfPlaces, organizer, status) {
    const data = {
      name: name,
      date: date,
      place: place,
      shortDesc: shortDesc,
      longDesc: longDesc,
      mainPhoto: mainPhoto,
      gallery: gallery,
      numOfPlaces: numOfPlaces,
      organizer: organizer,
      status: status
    }
    const dataSize = JSON.stringify(data).length;
    console.log('Data size:', dataSize);

    return this.http.post(`${this.url}/organizer/addWorkshop`, data)


  }

  getMyWorkshops(organizer) {
    const data = {
      organizer: organizer
    }

    return this.http.post(`${this.url}/organizer/getMyWorkshops`, data)
  }

  workshopDetails(id) {
    const data = {
      id: id
    }

    return this.http.post(`${this.url}/organizer/workshopDetails`, data)
  }

  editWorkshopDetailes(newDataValue, dataName, idWorkshop) {

    const data = {
      newDataValue: newDataValue,
      dataName: dataName,
      _id: idWorkshop
    }
    return this.http.post(`${this.url}/organizer/editWorkshopDetailes`, data)
  }




}
