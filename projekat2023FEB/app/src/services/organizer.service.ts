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

  getSignUpRequests(organizer) {
    const data = {
      organizer: organizer
    }
    return this.http.post(`${this.url}/organizer/getSignUpRequests`, data)
  }

  acceptRequestForWorkshop(username, idWorkshop) {
    const data = {
      username: username,
      idWorkshop: idWorkshop
    }
    return this.http.post(`${this.url}/organizer/acceptRequestForWorkshop`, data)
  }

  getMessageRequests(recipientUsername, workshopId) {
    const data = {
      recipientUsername: recipientUsername,
      workshopId: workshopId
    }

    return this.http.post(`${this.url}/organizer/getMessageRequests`, data);
  }

  getMessages(senderUsername, recipientUsername, workshopId) {
    const data = {
      senderUsername: senderUsername,
      recipientUsername: recipientUsername,
      workshopId: workshopId
    }

    return this.http.post(`${this.url}/organizer/getMessages`, data);
  }

  sendMessage(sender, recipient, content, timestamp, workshop) {
    const data = {
      workshop: workshop,
      sender: sender,
      recipient: recipient,
      content: content,
      timestamp: timestamp
    }
    return this.http.post(`${this.url}/organizer/sendMessage`, data);
  }


  cancelWorkshop(workshopId) {
    const data = {
      workshopId: workshopId
    }

    return this.http.post(`${this.url}/organizer/cancelWorkshop`, data);
  }

  saveAsTemplate(workshop) {
    const data = {
      workshop: workshop
    }
    return this.http.post(`${this.url}/organizer/saveAsTemplate`, data);
  }


  getNamesOfTemplates(organizer) {
    const data = {
      organizer: organizer
    }
    return this.http.post(`${this.url}/organizer/getNamesOfTemplates`, data);
  }


  getTemplateData(organizer, templateName) {
    const data = {
      organizer: organizer,
      templateName: templateName
    }
    return this.http.post(`${this.url}/organizer/getTemplateData`, data);

  }

}
