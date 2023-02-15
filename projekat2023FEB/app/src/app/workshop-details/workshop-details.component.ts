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

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.css']
})
export class WorkshopDetailsComponent implements OnInit {

  constructor(private chatService: ChatService, private router: Router, private organizerService: OrganizerService, private userService: UserService) { }
  ngOnInit(): void {

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let id = JSON.parse(localStorage.getItem("workshopID"));

    this.organizerService.workshopDetails(id).subscribe((workshop: Workshop) => {
      if (workshop) {
        this.currWorkshop = workshop;

        let date = new Date(workshop.date);
        this.dateAndTime = date.toLocaleDateString() + " " + date.toLocaleTimeString();

        this.imageDisplay = this.currWorkshop.gallery[0]
        // console.log("mesta ", this.currWorkshop.numOfPlaces)
        if (!this.currentUser.isOrganizer)
          this.getMessagesForNonOrganizer(this.currentUser.username, this.currWorkshop.organizer, this.currWorkshop._id);
        else if (this.currentUser.isOrganizer)
          this.getMessageRequests(this.currentUser.username, this.currWorkshop._id)
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
    //TODO
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

  logOut() {
    localStorage.removeItem("currentUser");
    this.currentUser = null;
    this.router.navigate([""]);
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

}
