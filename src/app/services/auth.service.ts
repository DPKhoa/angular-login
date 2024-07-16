import { User } from './../interfaces/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  registerUser(userDetails: User) {
    return this.http.post(`${this.baseUrl}/user`, userDetails);
  }
  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/user?email=${email}`);
  }
  sendLocation(location: {
    latitude: number;
    longtitude: number;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/location`, location);
  }
}
