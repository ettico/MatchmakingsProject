import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
// import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../app/models';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [MatButtonModule,RouterOutlet,RouterLink,MatButtonModule,MatIconModule,
    FormsModule   ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  // role:string|any=localStorage.getItem('role');
  // constructor(private role:'') {};
   user:User|any=localStorage.getItem('user');
   
}
