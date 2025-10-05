// filepath: /Users/mihai/Desktop/ProiectMF/AplicatiaMF/FrontEnd/src/app/pages/events/events.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface EventItem {
  id: number;
  eventTypeId: number;
  year: number;
  name: string;
  startDate: string; // ISO date string (e.g., 2025-11-01)
  endDate: string;   // ISO date string
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  private readonly http = inject(HttpClient);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly events = signal<EventItem[]>([]);

  constructor() {
    this.load();
  }

  // TrackBy to avoid unnecessary DOM churn
  readonly trackById = (_: number, item: EventItem) => item.id;

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<EventItem[]>(`http://localhost:5146/api/events/active`).subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data.slice() : [];
        // Sort by startDate ascending for a nicer default ordering
        list.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        this.events.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to load events');
        this.loading.set(false);
      }
    });
  }
}
