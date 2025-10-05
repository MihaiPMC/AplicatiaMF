import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly title = signal('ASMI M&F');
  readonly currentYear = new Date().getFullYear();

  // Expose auth state
  readonly user = this.auth.user; // signal<User|null>
  readonly isAuthed = this.auth.isAuthenticatedSig; // signal<boolean>
  readonly displayName = computed(() => this.user()?.name || this.user()?.email || '');

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
