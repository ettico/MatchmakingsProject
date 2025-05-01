import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
private baseUrl='https://localhost:7012/api/Admin/login';
  constructor(private http:HttpClient) { }
  Login(email:string,password:string):Observable<any>
  {
    const manager={email,password}
    return this.http.post(`${this.baseUrl}login`,manager).pipe(
      tap((response:any)=>{
        if(response.token){
          sessionStorage.setItem("token",response.token)
          localStorage.setItem('userId',response.userId);
          localStorage.setItem('role',response.role);
          console.log(sessionStorage.getItem("token"));
          console.log(localStorage.getItem("userId"));     
        }
      })
    )
  }
}
