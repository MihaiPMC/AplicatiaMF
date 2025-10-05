import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, of } from 'rxjs';

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

interface CompanyContact {
  contactTypeId?: number; // 1=email, 2=phone, 3=linkedin
  email?: string | null;
  phone?: string | null;
  value?: string | null;
  contactValue?: string | null;
  contact?: string | null;
  url?: string | null;
  link?: string | null;
  address?: string | null;
  [key: string]: any;
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

  // Contacts cache per company id
  readonly contactEmails = signal<Record<number, string[]>>({});
  readonly contactPhones = signal<Record<number, string[]>>({});
  readonly contactLinkedins = signal<Record<number, string[]>>({});

  constructor() {
    this.load();
  }

  readonly trackById = (_: number, item: CompanyItem) => item.id;

  // Ensure a URL has protocol for links (used for LinkedIn values)
  ensureUrl(u: string): string {
    if (!u) return '';
    return /^https?:\/\//i.test(u) ? u : `https://${u}`;
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<CompanyItem[]>(`http://localhost:5146/api/companies`).subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data.slice() : [];
        list.sort((a, b) => a.name.localeCompare(b.name));
        this.companies.set(list);
        this.loading.set(false);
        this.loadContactsForCompanies(list);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to load companies');
        this.loading.set(false);
        this.companies.set([]);
        this.contactEmails.set({});
        this.contactPhones.set({});
        this.contactLinkedins.set({});
      }
    });
  }

  private extractValue(c: CompanyContact): string {
    const v = c.value ?? c.contactValue ?? c.contact ?? c.url ?? c.link ?? c.email ?? c.phone ?? c.address;
    return (v ?? '').toString().trim();
  }

  private loadContactsForCompanies(list: CompanyItem[]) {
    if (!list.length) {
      this.contactEmails.set({});
      this.contactPhones.set({});
      this.contactLinkedins.set({});
      return;
    }
    const calls = list.map((c) =>
      this.http
        .get<CompanyContact[]>(`http://localhost:5146/api/companies/${c.id}/contacts`)
        .pipe(
          catchError(() => of([] as CompanyContact[])),
          map((arr) => ({ id: c.id, arr }))
        )
    );
    forkJoin(calls).subscribe((results) => {
      const eMap: Record<number, string[]> = {};
      const pMap: Record<number, string[]> = {};
      const lMap: Record<number, string[]> = {};
      for (const { id, arr } of results) {
        const emails: string[] = [];
        const phones: string[] = [];
        const links: string[] = [];
        for (const item of arr) {
          const v = this.extractValue(item);
          if (!v) continue;
          switch (item.contactTypeId) {
            case 1: emails.push(v); break;
            case 2: phones.push(v); break;
            case 3: links.push(v); break;
            default: break;
          }
        }
        eMap[id] = Array.from(new Set(emails));
        pMap[id] = Array.from(new Set(phones));
        lMap[id] = Array.from(new Set(links));
      }
      this.contactEmails.set(eMap);
      this.contactPhones.set(pMap);
      this.contactLinkedins.set(lMap);
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
