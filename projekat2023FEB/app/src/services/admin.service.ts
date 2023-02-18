import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private router: Router) { }

  private httpStr: string = "";
  url = 'http://localhost:4000';

  login(username, password) {

    const data = {
      username: username,
      password: password
    }
    // console.log("service: ",username,password)

    return this.http.post(`${this.url}/admin/login`, data);

  }

  getRegistrationRequests() {

    return this.http.get(`${this.url}/admin/getRegistrationRequests`);
  }

  getWorkshopPropositions() {

    return this.http.get(`${this.url}/admin/getWorkshopPropositions`);
  }


  getAllUsers() {
    return this.http.get(`${this.url}/admin/getAllUsers`);
  }

  getAllOrganizers() {
    return this.http.get(`${this.url}/admin/getAllOrganizers`);
  }

  getAllWorkshops() {
    return this.http.get(`${this.url}/admin/getAllWorkshops`);
  }

  updateStatus(username, value) {
    const data = {
      username: username,
      value: value
    }
    return this.http.post(`${this.url}/admin/updateStatus`, data);

  }

  approveWorkshop(id) {
    const data = {
      id: id
    }
    return this.http.post(`${this.url}/admin/approveWorkshop`, data);

  }

  changePassword(username, newPass) {
    const data = {
      username: username,
      newPass: newPass
    }
    return this.http.post(`${this.url}/admin/changePassword`, data);
  }


  

}
