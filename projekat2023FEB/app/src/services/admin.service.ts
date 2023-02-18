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

  appoveUser(username) {
    const data = {
      username: username
    }
    return this.http.post(`${this.url}/admin/appoveUser`, data);

  }

}
