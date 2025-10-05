import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ASMI M&F');
  readonly currentYear = new Date().getFullYear();
  private readonly auth = inject(AuthService);

  get isAuthed() { return this.auth.isAuthenticated; }

  logout() {
    this.auth.logout();
  }
}
