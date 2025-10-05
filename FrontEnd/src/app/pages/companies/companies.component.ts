// filepath: /Users/mihai/Desktop/ProiectMF/AplicatiaMF/FrontEnd/src/app/pages/companies/companies.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface CompanyItem {
  id: number;
  name: string;
  website: string | null;
  notes: string | null;
  canContactAd: boolean;
  canContactBb: boolean;
  canContactCa: boolean;
  canContactMi: boolean;
  canContactSh: boolean;
  canContactZa: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent {
  private readonly http = inject(HttpClient);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly companies = signal<CompanyItem[]>([]);

  constructor() {
    this.load();
  }

  readonly trackById = (_: number, item: CompanyItem) => item.id;

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<CompanyItem[]>(`http://localhost:5146/api/companies`).subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data.slice() : [];
        list.sort((a, b) => a.name.localeCompare(b.name));
        this.companies.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to load companies');
        this.loading.set(false);
      }
    });
  }

  getAllowedContacts(c: CompanyItem): string[] {
    const map: [keyof CompanyItem, string][] = [
      ['canContactAd', 'Ad'],
      ['canContactBb', 'Bb'],
      ['canContactCa', 'Ca'],
      ['canContactMi', 'Mi'],
      ['canContactSh', 'Sh'],
      ['canContactZa', 'Za'],
    ];
    const out: string[] = [];
    for (const [key, label] of map) {
      if (c[key] as unknown as boolean) out.push(label);
    }
    return out;
  }
}
