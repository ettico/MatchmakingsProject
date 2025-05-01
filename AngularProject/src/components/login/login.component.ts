import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// import { Route } from '@angular/router';
import { LoginServiceService } from '../../services/loginService/login-service.service';
@Component({
  selector: 'app-login',
  standalone:true,
  imports: [  
     MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

  export class LoginComponent  {
    registerForm: FormGroup;
    show=true;
    login=false;
    constructor(private fb: FormBuilder, private authService: LoginServiceService) {
      this.registerForm = this.fb.group({
        user:fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['',[ Validators.required,Validators.minLength(5)]]
      })
    });
    }
  
    showpassword() {
      this.show = !this.show;
    }
    onLogin(): void {
      if (this.registerForm.valid) {
        console.log(this.registerForm.value);
        
        this.authService.Login(this.registerForm.value.user.email,this.registerForm.value.user.password).subscribe({
          next:(data:any)=>{
            console.log("login succseed");
            // localStorage.setItem('role',data.role);
            localStorage.setItem('user',data);
            this.login=true;
            
          },error:(err:any)=>console.log("no login")
          
        });
      };
      console.log(sessionStorage.getItem("token"));
      
    }
  }

