import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  @ViewChild(LoginComponent) private loginComponent?: LoginComponent;

  openLoginModal(): void {
    this.loginComponent?.openLoginModal();
  }
}
