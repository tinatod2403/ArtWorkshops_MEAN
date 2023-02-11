import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-become-organizer',
  templateUrl: './become-organizer.component.html',
  styleUrls: ['./become-organizer.component.css']
})
export class BecomeOrganizerComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

  }

  public currentUser: User;

  logOut() {
    localStorage.removeItem("currentUser");
    this.currentUser = null;
    this.router.navigate([""]);
  }


}
