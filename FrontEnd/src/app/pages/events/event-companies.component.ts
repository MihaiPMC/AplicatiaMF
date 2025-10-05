import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  selector: 'app-event-companies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-companies.component.html',
  styleUrl: './event-companies.component.css'
})
export class EventCompaniesComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly companies = signal<CompanyItem[]>([]);

  // Contacts cache per company id
  readonly contactEmails = signal<Record<number, string[]>>({});
  readonly contactPhones = signal<Record<number, string[]>>({});
  readonly contactLinkedins = signal<Record<number, string[]>>({});

  // Event info from route/query
  readonly eventId = signal<number | null>(null);
  readonly eventTypeId = signal<number | null>(null);
  readonly eventName = signal<string | null>(null);
  readonly eventYear = signal<number | null>(null);

  // Assumption: event type IDs mapping
  // 1: AD (Arta-n Dar), 2: BB (Balul Bobocilor), 3: CA (Cariere), 4: Mi (MateInfoUB), 5: SH (Smarthack), 6: ZA (Zilele ASMI)
  readonly eventTypeMap: Record<number, { code: 'Ad'|'Bb'|'Ca'|'Mi'|'Sh'|'Za', label: string, flag: keyof CompanyItem }> = {
    1: { code: 'Ad', label: 'Arta-n Dar', flag: 'canContactAd' },
    2: { code: 'Bb', label: 'Balul Bobocilor', flag: 'canContactBb' },
    3: { code: 'Ca', label: 'Cariere', flag: 'canContactCa' },
    4: { code: 'Mi', label: 'MateInfoUB', flag: 'canContactMi' },
    5: { code: 'Sh', label: 'Smarthack', flag: 'canContactSh' },
    6: { code: 'Za', label: 'Zilele ASMI', flag: 'canContactZa' },
  } as const;

  readonly eventTypeLabel = computed(() => {
    const id = this.eventTypeId();
    if (!id) return null;
    return this.eventTypeMap[id]?.label ?? `Type ${id}`;
  });

  constructor() {
    this.route.paramMap.subscribe(pm => {
      const idParam = pm.get('id');
      const tParam = pm.get('eventTypeId');
      this.eventId.set(idParam ? +idParam : null);
      this.eventTypeId.set(tParam ? +tParam : null);
    });

    this.route.queryParamMap.subscribe(q => {
      const name = q.get('name');
      const year = q.get('year');
      this.eventName.set(name);
      this.eventYear.set(year ? +year : null);
    });

    // Trigger load whenever type changes
    this.route.paramMap.subscribe(() => this.load());
  }

  readonly trackById = (_: number, item: CompanyItem) => item.id;

  // Ensure a URL has protocol for links (used for LinkedIn values)
  ensureUrl(u: string): string {
    if (!u) return '';
    return /^https?:\/\//i.test(u) ? u : `https://${u}`;
  }

  private extractValue(c: CompanyContact): string {
    const v = c.value ?? c.contactValue ?? c.contact ?? c.url ?? c.link ?? c.email ?? c.phone ?? c.address;
    return (v ?? '').toString().trim();
  }

  private buildUrl(): string | null {
    const typeId = this.eventTypeId();
    if (!typeId) return null;
    const mapping = this.eventTypeMap[typeId];
    if (!mapping) {
      return null;
    }
    const url = new URL('http://localhost:5146/api/companies');
    url.searchParams.set(mapping.flag, 'true');
    return url.toString();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    const url = this.buildUrl();
    if (!url) {
      this.loading.set(false);
      this.error.set('Unknown or missing event type.');
      this.companies.set([]);
      this.contactEmails.set({});
      this.contactPhones.set({});
      this.contactLinkedins.set({});
      return;
    }

    this.http.get<CompanyItem[]>(url).subscribe({
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
}
