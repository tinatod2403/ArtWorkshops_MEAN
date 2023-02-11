import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }
  private httpStr: string = "";
  url = 'http://localhost:4000';

  login(username, password) {

    const data = {
      username: username,
      password: password
    }
    console.log("service: ",username,password)
    return this.http.post(`${this.url}/user/login`, data);

  }

  register(firstname, lastname, username, password, phone, email, picture
    , isOrganizer, organizationName, oAddress, IDorganization, status) {

    const data = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: password,
      phone: phone,
      email: email,
      picture: picture,
      isOrganizer: isOrganizer,
      organizationName: organizationName,
      address: oAddress,
      IDorganization: IDorganization,
      status: status
    }
    return this.http.post(`${this.url}/user/register`, data);

  }




}
