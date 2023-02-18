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

  sendMessage(sender, recipient, content, timestamp, workshop) {
    const data = {
      workshop: workshop,
      sender: sender,
      recipient: recipient,
      content: content,
      timestamp: timestamp
    }
    return this.http.post(`${this.url}/user/sendMessage`, data);
  }


  getMessages(senderUsername, recipientUsername, workshopId) {
    const data = {
      senderUsername: senderUsername,
      recipientUsername: recipientUsername,
      workshopId: workshopId
    }

    return this.http.post(`${this.url}/user/getMessages`, data);
  }


  sendComment(sender, workshop, content, timestamp) {

    const data = {
      sender: sender,
      workshop: workshop,
      content: content,
      timestamp: timestamp
    }

    return this.http.post(`${this.url}/user/sendComment`, data);

  }


  getWorkshopComments(workshop) {
    const data = {
      workshop: workshop
    }

    return this.http.post(`${this.url}/user/getWorkshopComments`, data);
  }

  likeWorkshop(user, workshop) {
    const data = {
      user: user,
      workshop: workshop
    }
    return this.http.post(`${this.url}/user/likeWorkshop`, data);
  }

  unlikeWorkshop(user, workshop) {
    const data = {
      user: user,
      workshop: workshop
    }
    return this.http.post(`${this.url}/user/unlikeWorkshop`, data);
  }

}
