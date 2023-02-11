import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }
  private httpStr: string = "";
  url = 'http://localhost:4000';

  editData(newDataValue, dataName, username) {

    const data = {
      newDataValue: newDataValue,
      dataName: dataName,
      username: username
    }
    return this.http.post(`${this.url}/user/editData`, data);

  }

  getUserData(username) {

    const data = {
      username: username
    }

    return this.http.post(`${this.url}/user/getUserData`, data);
  }

  getAllActiveWorkshops() {
    return this.http.get(`${this.url}/user/getAllActiveWorkshops`);
  }

  searchWorkshops(searchValue) {
    const data = {
      searchValue: searchValue
    }
    return this.http.post(`${this.url}/user/searchWorkshops`, data);
  }

  signUpForWorkshop(username, idWorkshop, organizer, nameWorkshop, userPicture, workshopPicture,
    signUpDate, workshopDate, status) {

    const data = {
      username: username,
      idWorkshop: idWorkshop,
      organizer: organizer,
      nameWorkshop: nameWorkshop,
      userPicture: userPicture,
      workshopPicture: workshopPicture,
      signUpDate: signUpDate,
      workshopDate: workshopDate,
      status: status,
    }
    return this.http.post(`${this.url}/user/signUpForWorkshop`, data);
  }

  getUserRegistWorkshops(username) {
    const data = {
      username: username
    }
    return this.http.post(`${this.url}/user/getUserRegistWorkshops`, data);
  }

  getPassedWorkshops(username) {
    const data = {
      username: username
    }
    return this.http.post(`${this.url}/user/getPassedWorkshops`, data);
  }



}
