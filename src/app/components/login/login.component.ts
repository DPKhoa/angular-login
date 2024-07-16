import { LocationService } from './../../services/location.service';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    RouterLink,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private locationService: LocationService,
    private msgService: MessageService
  ) {
    // Khởi tạo loginForm bên trong constructor để đảm bảo fb đã được khởi tạo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }
  loginUser() {
    const { email, password } = this.loginForm.value;

    this.authService.getUserByEmail(email as string).subscribe(
      (response) => {
        if (response.length > 0 && response[0].password === password) {
          this.locationService.getCurrentPosition().then((position) => {
            const location = {
              latitude: position.coords.latitude,
              longtitude: position.coords.longitude,
            };
            console.log('Location:', location);
            // Gửi thông tin vị trí đến server
            this.authService.sendLocation(location).subscribe(
              (res) => {
                sessionStorage.setItem('email', email);
                this.router.navigate(['/home']);
              },
              (error) => {
                this.msgService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Unable to send location',
                });
              }
            );
          });
          sessionStorage.setItem('email', email as string);
          this.router.navigate(['/home']);
        } else {
          this.msgService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'email or password is wrong',
          });
        }
      },
      (error) => {
        this.msgService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong',
        });
      }
    );
  }
}
