import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/services/login.service';
import { UserService } from 'src/services/user.service';
import { Like } from '../models/Like';
import { SignUps } from '../models/signUps';
import { User } from '../models/user';
import { Comment } from '../models/Comment';
import { MessageReqest } from '../models/MessageRequest';
import { Message } from '../models/Message';
import { Workshop } from '../models/workshop';
import { OrganizerService } from 'src/services/organizer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private organizerService: OrganizerService, private router: Router, private ls: LoginService, private userService: UserService) { }

  public edit: string = "";

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.userService.getUserData(this.currentUser.username).subscribe((user: User) => {
      this.currentUser = user;
    });

    this.userService.getAllUserLikedWorkshops(this.currentUser.username).subscribe((likes: Like[]) => {
      if (likes.length > 0) {
        this.allMyLikes = likes
        console.log("Likes: ", this.allMyLikes)
      }
      else
        this.emptyLikes = "No liked workshops yet."
    })

    this.userService.getAllUserComments(this.currentUser.username).subscribe((comm: Comment[]) => {
      if (comm.length > 0) {
        this.allMyComments = comm;
        this.allMyComments.forEach(comm => {
          comm.timestamp = (new Date(comm.timestamp)).toLocaleString("en-UK")
        })
        console.log("Comments: ", this.allMyComments)
      }
      else
        this.emptyComm = "No comments on workshops yet."
    })

    this.userService.getPassedWorkshops(this.currentUser.username).subscribe((signUps: SignUps[]) => {
      if (signUps.length > 0) {
        this.pastSignUps = signUps;
        console.log("Passed", signUps)

        this.pastSignUps.forEach(w => {
          w.workshopDate = new Date(w.workshopDate).toLocaleString('en-US');
          w.signUpDate = new Date(w.signUpDate).toLocaleString('en-US');
        })
      }
      else {
        this.informMessage = "You haven't been to any workshops yet."
      }
    })

    this.userService.getMyMessages(this.currentUser).subscribe((mess: MessageReqest[]) => {
      if (mess) {
        this.sentMessages = mess;
        console.log("sentMessages", this.sentMessages)
      }
    })

  }

  currentUser: User;
  firstnameEdit: string = "";
  lastnameEdit: string = "";
  usernameEdit: string = "";
  passwordEdit: string = "";
  phoneEdit: string = "";
  emailEdit: string = "";
  pictureEdit: any = "../../assets/avatar.jpg";

  passwordNew: string = "";
  passwordNewAgain: string = "";
  errorMessage: string = "";

  pastSignUps: SignUps[] = [];
  informMessage: string = "";

  editData(currEditing: string) {
    this.edit = currEditing;
  }
  cancelEditing() {
    this.errorMessage = "";
    this.edit = "";
  }

  doneEditing(newData: string, currEditing: string) {
    console.log('newData ', newData)
    console.log('currEditing ', currEditing)

    if (currEditing == "password") {
      console.log("this.passwordEdit: ", this.passwordEdit)
      if (this.passwordEdit == "" || this.passwordNew == "" || this.passwordNewAgain == "") {

        this.errorMessage = "Error: You must fill in all fields before changing password.";
        return;
      }
      const passwordRegex = /^[a-z](?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,15}$/;
      if (!passwordRegex.test(this.passwordNew)) {
        this.errorMessage = "Error: Password not in right format."
        return;
      }
      if (this.passwordNew != this.passwordNewAgain) {
        this.errorMessage = "Error: Passwords do not match."
        return;
      }
      if (this.currentUser.password != this.passwordEdit) {
        this.errorMessage = "Error: Wrong old password."
        return;
      }
    }

    this.userService.editData(newData, currEditing,
      this.currentUser.username).subscribe((resp) => {
        // if (resp['resp'] == 'username exists') {
        //   this.errorMessage = "Error: User with this username already exists."
        //   return;
        // }
        // if (resp['resp'] == 'email exists') {
        //   this.errorMessage = "Error: User with this email already exists."
        //   return;
        // }
        if (resp['resp'] == "OK") {
          // alert("Succesfull editing");
        }


      })


    this.userService.getUserData(this.currentUser.username).subscribe((user: User) => {
      if (user) {
        this.currentUser = user;
      }
    })
    localStorage.setItem("currentUser", JSON.stringify(this.currentUser))

    this.errorMessage = "";
    this.edit = "";
  }

  sortName() {
    this.pastSignUps.sort((a, b) => {
      if (a.nameWorkshop < b.nameWorkshop) return 1;
      if (a.nameWorkshop > b.nameWorkshop) return -1;
      return 0;
    })
  }

  sortDate() {
    this.pastSignUps.sort((a, b) => {
      if (new Date(a.workshopDate) > new Date(b.workshopDate)) return 1;
      if (new Date(a.workshopDate) < new Date(b.workshopDate)) return -1;
      return 0;
    })
  }

  sortTimeStamp() {
    this.pastSignUps.sort((a, b) => {
      if (new Date(a.signUpDate) > new Date(b.signUpDate)) return 1;
      if (new Date(a.signUpDate) < new Date(b.signUpDate)) return -1;
      return 0;
    })
  }

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }



  allMyLikes: Like[] = [];
  emptyLikes: string = "";
  allMyComments: Comment[] = [];
  emptyComm: string = "";
  sentMessages: MessageReqest[] = [];
  messageContent: string;
  chatOpened: boolean = false;

  unLike(workshop) {
    let result = confirm("Are you sure you want to remove " + workshop.name + " from liked wokrshops?")
    if (result) {
      this.userService.unlikeWorkshop(this.currentUser, workshop).subscribe((resp) => {
        if (resp["resp"] == "OK") {
          this.allMyLikes = this.allMyLikes.filter(like => like.workshop._id != workshop._id)
          if (this.allMyLikes.length == 0) {
            this.emptyLikes = "No liked workshops yet."
          }
        }
      })
    }
  }

  openChat(messageBox) {

    messageBox.opened = !messageBox.opened

    this.sentMessages.forEach(sm => {
      if (sm != messageBox) {
        sm.opened = false
      }
    })
    if (messageBox.opened && !messageBox.beenOpened)
      this.userService.getMessages(this.currentUser.username, messageBox.senderUsername,
        messageBox.workshopID).subscribe((mess: Message[]) => {
          messageBox.messages = mess
          messageBox.beenOpened = true
        })

  }

  sendMessageToUser(recipient) {
    console.log(recipient)
    if (this.messageContent == "") {
      return;
    }

    this.organizerService.workshopDetails(recipient.workshopID).subscribe((w: Workshop) => {
      if (w) {
        let reciver = new User();
        reciver.username = recipient.senderUsername;
        reciver.picture = recipient.senderPicture;
        this.organizerService.sendMessage(this.currentUser, reciver,
          this.messageContent, new Date(), w).subscribe((resp) => {
            if (resp["resp"] == "OK") {
              this.messageContent = "";
              this.sentMessages.forEach(m => {
                if (m.senderUsername == recipient.senderUsername) {
                  this.organizerService.getMessages(this.currentUser.username, recipient.senderUsername, w._id).subscribe(
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
    })


  }

  editComment(comm) {
    comm.editing = true;
  }

  doneEditComment(comm) {
    comm.editing = false;
    console.log(comm)
    this.userService.editComment(comm).subscribe((comm: Comment[]) => {
      if (comm) {
        this.allMyComments = comm
      }
    })
  }

  deleteComment(comm) {
    let result = confirm('Are you sure you want to delete comment:\n"' + comm.content + '"?')

    if (result) {
      this.userService.deleteComment(comm).subscribe((comms: Comment[]) => {
        this.allMyComments = comms;
        if (comms.length == 0) {
          this.emptyComm = "No comments on workshops yet."
        }
      })
    }
  }

  logOut() {
    localStorage.removeItem("currentUser");
    this.currentUser = null;
    this.router.navigate([""]);
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


  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {

        let img: any;
        img = reader.result;

        const image = new Image();
        image.src = img;
        image.onload = () => {
          if (image.width < 100 || image.width > 300 || image.height < 100 || image.height > 300) {
            this.pictureEdit = "../../assets/avatar.jpg";
            this.errorMessage = "Image must be between 100x100 and 300x300 pixels"
          }
          else {
            this.pictureEdit = reader.result;
            this.errorMessage = ""
          }
        };

      };

    }
  }

}
