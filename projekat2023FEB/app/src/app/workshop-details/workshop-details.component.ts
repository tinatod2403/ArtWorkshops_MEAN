import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/services/chat.service';
import { OrganizerService } from 'src/services/organizer.service';
import { UserService } from 'src/services/user.service';
import { User } from '../models/user';
import { Workshop } from '../models/workshop';
import { ViewChild, ElementRef } from '@angular/core';
import { Message } from '../models/Message';
import { MessageReqest } from '../models/MessageRequest';
import { Comment } from '../models/Comment'
import { OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Like } from '../models/Like';

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.css']
})


export class WorkshopDetailsComponent implements OnInit, OnDestroy {

  constructor(private chatService: ChatService, private router: Router, private organizerService: OrganizerService, private userService: UserService) { }


  ngOnInit(): void {


    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let id = JSON.parse(localStorage.getItem("workshopID"));

    this.organizerService.workshopDetails(id).subscribe((workshop: Workshop) => {
      if (workshop) {
        this.currWorkshop = workshop;

        this.userService.likesOfWorkshop(this.currentUser, this.currWorkshop).subscribe((resp) => {
          if (resp["likes"]) {
            this.allLikes = resp["likes"]
            this.numOfLikes = resp["likes"].length
            console.log("Likes: ", this.allLikes)

            if (resp["resp"] == "noUser") this.liked = false;
            if (resp["resp"] == "yesUser") this.liked = true;

          }
          else
            this.numOfLikes = 0;
        })

        let date = new Date(workshop.date);
        this.dateAndTime = date.toLocaleDateString() + " " + date.toLocaleTimeString();

        this.imageDisplay = this.currWorkshop.gallery[0]
        // console.log("mesta ", this.currWorkshop.numOfPlaces)
        if (!this.currentUser.isOrganizer)
          this.getMessagesForNonOrganizer(this.currentUser.username, this.currWorkshop.organizer, this.currWorkshop._id);
        else if (this.currentUser.isOrganizer)
          this.getMessageRequests(this.currentUser.username, this.currWorkshop._id)

        this.userService.getWorkshopComments(this.currWorkshop).subscribe((c: Comment[]) => {
          if (c) {
            this.workshopComments = c;
            console.log(this.workshopComments)
          }
        })
      }
      else {
        console.log("Error with getting workshop details.")
      }
    })



    this.userService.getUserData(this.currentUser.username).subscribe((user: User) => {
      this.currentUser = user;
    });


  }

  currentUser: User;
  currWorkshop: Workshop;
  errorMessage: string;
  dateAndTime: any;
  iterator: number = 0;
  imageDisplay: string;
  messageContent: string = "";

  signUp() {
    if (this.currWorkshop.numOfPlaces == 0) {
      this.errorMessage = "No more places available for this workshop"
      return;
    }
    this.userService.signUpForWorkshop(this.currentUser.username, this.currWorkshop._id, this.currWorkshop.organizer,
      this.currWorkshop.name, this.currentUser.picture, this.currWorkshop.mainPhoto, new Date(),
      new Date(this.currWorkshop.date), 'pending').subscribe((resp) => {
        if (resp["resp"] == "OK") {
          alert("You have successfully signed up for this workshop.")
        }
        else if (resp["resp"] == "exists") {
          this.errorMessage = "You already signed up for this workshop."
          return;
        }
        else {
          console.log("Neuspesno Signupovan")
        }
      })

  }

  cancelWorkshop(id) {
    let result = confirm("Are you sure you want to cancel this workshop?");
    if (result) {

    }
    else {

    }
  }

  editWorkshop(event, id) {
    event.stopPropagation()
    localStorage.setItem("workshopID", JSON.stringify(id));
    this.router.navigate(["/editWorkshop"]);
  }

  toNotify() {
    this.userService.waitlistForWorkshop(this.currentUser, this.currWorkshop).subscribe((resp) => {
      if (resp["resp"] == "OK") {
        alert("You will be notified when place is available.")
      }
      else if (resp["resp"] == "already") {
        this.errorMessage = "You are already on waitlist."
      }
    })
  }

  previous() {

    this.iterator = (this.iterator - 1 + this.currWorkshop.gallery.length) % this.currWorkshop.gallery.length;
    console.log(this.iterator)
    this.imageDisplay = this.currWorkshop.gallery[this.iterator]
  }
  next() {
    this.iterator = (this.iterator + 1 + this.currWorkshop.gallery.length) % this.currWorkshop.gallery.length;
    this.imageDisplay = this.currWorkshop.gallery[this.iterator]
  }



  chatOpened: boolean = false;

  startChat() {
    this.chatOpened = true;
    this.ngAfterViewChecked()
  }

  endChat() {
    this.chatOpened = false;
  }

  @ViewChild('scrollContainer') private myScrollContainer: ElementRef;


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  getMessagesForNonOrganizer(senderUsername, recipientUsername, workshopId) {
    // console.log("uzimam")
    this.userService.getMessages(senderUsername, recipientUsername, workshopId).subscribe((m: Message[]) => {
      if (m) {
        this.myMessages = m;
        // console.log("Messages: ", this.myMessages)
        this.myMessages.forEach(m => {
          m.timestamp = new Date(m.timestamp).toLocaleString('en-US')
        })
      }
      else {
        console.log("e", m)
      }
    })

  }



  sender: User;
  recipient: User;
  workshopHlp: Workshop;
  myMessages: Message[] = [];

  sendMessage() {
    if (this.messageContent == "") return;
    let messageTime = new Date();

    this.sender = new User();
    this.sender.username = this.currentUser.username;
    this.sender.picture = this.currentUser.picture;

    this.recipient = new User();
    this.userService.getUserData(this.currWorkshop.organizer).subscribe((user: User) => {
      if (user) {
        this.recipient.username = user.username;
        this.recipient.picture = user.picture;

        this.workshopHlp = new Workshop();
        this.workshopHlp._id = this.currWorkshop._id
        this.workshopHlp.name = this.currWorkshop.name

        this.userService.sendMessage(this.sender, this.recipient, this.messageContent, messageTime, this.workshopHlp).subscribe((resp) => {
          if (resp["resp"] == "OK") {
            this.messageContent = "";
            this.getMessagesForNonOrganizer(this.sender.username, this.recipient.username, this.currWorkshop._id);
          }
          else {
            console.log("error inputing message")
          }
        })
      }
      else {
        alert("bad data geting recipient")
      }
    })

  }


  messageReqests: MessageReqest[] = [];

  getMessageRequests(recipientUsername, workshopId) {
    this.organizerService.getMessageRequests(recipientUsername, workshopId).subscribe((mess: MessageReqest[]) => {
      if (mess) {
        this.messageReqests = mess;
        console.log("Poruke", this.messageReqests)
      }
    })
  }

  openChat(senderUsername) {

    this.messageReqests.forEach(m => {
      if (m.senderUsername == senderUsername) {
        if (m.opened) {
          m.opened = false;
          return;
        }
        if (!m.beenOpened) {
          m.beenOpened = true;
          m.opened = true;
          this.organizerService.getMessages(this.currentUser.username, senderUsername, this.currWorkshop._id).subscribe(
            (mess: Message[]) => {
              m.messages = mess;
              console.log("Nadam se da jednom udje: ", m)
            }
          )
        }
        m.opened = true;
      }
    })

  }

  saveAsTemplate(workshop) {
    this.organizerService.saveAsTemplate(workshop).subscribe((resp) => {
      if (resp["resp"] == "OK") {
        alert("You saved " + workshop.name + " template succsfully.")
      }
    })
  }

  sendMessageToUser(recipientRequest) {

    if (this.messageContent == "") {
      return;
    }

    let sender = new User();
    sender.username = this.currentUser.username;
    sender.picture = this.currentUser.picture;

    let recipient = new User();
    recipient.username = recipientRequest.senderUsername;
    recipient.picture = recipientRequest.senderPicture;

    let workshop = new Workshop();
    workshop._id = this.currWorkshop._id

    this.organizerService.sendMessage(sender, recipient,
      this.messageContent, new Date(), workshop).subscribe((resp) => {
        if (resp["resp"] == "OK") {
          this.messageContent = "";
          this.messageReqests.forEach(m => {
            if (m.senderUsername == recipientRequest.senderUsername) {
              this.organizerService.getMessages(this.currentUser.username, recipientRequest.senderUsername, this.currWorkshop._id).subscribe(
                (mess: Message[]) => {
                  m.messages = mess;
                  console.log("Nadam se da jednom udje: ", m)

                }
              )
            }
          })

        }
      })
  }



  commentContent: string = "";
  workshopComments: Comment[] = [];

  sendComment() {
    if (this.commentContent == "") return;

    this.userService.sendComment(this.currentUser, this.currWorkshop, this.commentContent, new Date()).subscribe((resp) => {
      if (resp["resp"] == "OK") {
        this.userService.getWorkshopComments(this.currWorkshop).subscribe((c: Comment[]) => {
          if (c) {
            this.workshopComments = c;
            this.commentContent = "";
          }
        })
      }
    })

    // alert(this.commentContent)
  }

  initializeMap = false;
  openMap() {
    if (!this.initializeMap) {
      const address = this.currWorkshop.place; // Example address
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          const lat = data[0].lat;
          const lon = data[0].lon;
          const map = L.map('map').setView([lat, lon], 13);

          const marker = L.marker([lat, lon]).addTo(map);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            maxZoom: 18,
          }).addTo(map);
          marker.bindPopup("<b>Here it is!</b><br>" + this.currWorkshop.place).openPopup();
        });
    }
  }


  liked: boolean = false;
  numOfLikes: number;
  allLikes: Like[] = [];


  like() {
    this.liked = true;
    this.numOfLikes++;
  }

  unlike() {
    this.liked = false;
    this.numOfLikes--;
  }


  ngOnDestroy(): void {

    if (this.liked)
      this.userService.likeWorkshop(this.currentUser, this.currWorkshop).subscribe((resp) => {
        if (resp["resp"] == "OK") {
          console.log("liked")
        }
      })
    else
      this.userService.unlikeWorkshop(this.currentUser, this.currWorkshop).subscribe((resp) => {
        if (resp["resp"] == "OK") {
          console.log("UNliked")
        }
      })
  }

  logOut() {
    localStorage.removeItem("currentUser");
    this.currentUser = null;
    this.router.navigate([""]);
  }

}
