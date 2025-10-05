import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
interface EmailTemplate {
  id: number;
  name?: string;
  subject?: string;
  body?: string;
  description?: string;
  cc?: string | string[] | null;
  // ...potential alternate fields from API
  title?: string;
  emailSubject?: string;
  content?: string;
  html?: string;
  emailBody?: string;
  templateBody?: string;
  emailContent?: string;
  ccs?: string[] | string | null;
  ccList?: string[] | string | null;
  ccEmails?: string[] | string | null;
  [key: string]: any;
}

interface CompanyContact {
  contactTypeId?: number; // 1=email
  email?: string | null;
  value?: string | null;
  contactValue?: string | null;
  contact?: string | null;
  [key: string]: any;
}

@Component({
  selector: 'app-contact-company',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './contact-company.component.html',
  styleUrl: './contact-company.component.css'
})
export class ContactCompanyComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  // Route params
  readonly eventId = signal<number | null>(null);
  readonly eventTypeId = signal<number | null>(null);
  readonly companyId = signal<number | null>(null);

  // From query params for UX context
  readonly companyName = signal<string | null>(null);
  readonly eventName = signal<string | null>(null);
  readonly eventYear = signal<number | null>(null);

  // Data state
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly templates = signal<EmailTemplate[]>([]);
  readonly companyEmails = signal<string[]>([]);

  // Form (only fields user must provide)
  readonly form = this.fb.nonNullable.group({
    to: ['', [Validators.required, Validators.email]],
    templateId: [0 as number, [Validators.required, Validators.min(1)]],
    scheduledAt: ['', [Validators.required]], // datetime-local string
  });

  // Bridge form control -> signals so computed previews update
  private readonly selectedTemplateId = signal<number | null>(null);

  readonly hasContacts = computed(() => this.companyEmails().length > 0);
  readonly selectedTemplate = computed(() => {
    const sel = this.selectedTemplateId();
    return this.templates().find(t => String(t.id) === String(sel)) || null;
  });
  readonly templateSubject = computed(() => extractTemplateSubject(this.selectedTemplate()));
  readonly templateContent = computed(() => extractTemplateContent(this.selectedTemplate()));
  readonly templateCc = computed(() => extractTemplateCc(this.selectedTemplate()));

  constructor() {
    // Initialize selected template id from form value
    const initialTid = this.form.controls.templateId.value;
    this.selectedTemplateId.set(initialTid != null ? Number(initialTid) : null);
    // Reflect changes from the select into the signal
    this.form.controls.templateId.valueChanges.subscribe((id) => {
      this.selectedTemplateId.set(id != null ? Number(id) : null);
    });

    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      const t = pm.get('eventTypeId');
      const c = pm.get('companyId');
      this.eventId.set(id ? +id : null);
      this.eventTypeId.set(t ? +t : null);
      this.companyId.set(c ? +c : null);
      // Load once params are available
      this.load();
    });
    this.route.queryParamMap.subscribe(q => {
      const cn = q.get('companyName');
      const en = q.get('eventName');
      const ey = q.get('eventYear');
      this.companyName.set(cn);
      this.eventName.set(en);
      this.eventYear.set(ey ? +ey : null);
    });
  }

  private load() {
    this.loading.set(true);
    this.error.set(null);

    const companyId = this.companyId();
    if (!companyId) {
      this.loading.set(false);
      this.error.set('Missing company.');
      return;
    }

    const templates$ = this.http.get<EmailTemplate[]>(`http://localhost:5146/api/emails`);
    const contacts$ = this.http.get<CompanyContact[]>(`http://localhost:5146/api/companies/${companyId}/contacts`);

    forkJoin({ templates: templates$, contacts: contacts$ }).subscribe({
      next: ({ templates, contacts }) => {
        // Normalize templates to ensure a valid id
        const normalizedTemplates = (Array.isArray(templates) ? templates : []).filter(
          (it: any): it is EmailTemplate => Number.isFinite(it?.id) && it.id > 0
        );
        this.templates.set(normalizedTemplates);

        // Extract unique email contacts
        const set = new Set<string>();
        const list = Array.isArray(contacts) ? contacts : [];
        for (const c of list) {
          if (c && (c.contactTypeId === 1 || c.email || c.value || c.contactValue || c.contact)) {
            const v = (c.value ?? c.contactValue ?? c.contact ?? c.email ?? '')
              .toString()
              .trim();
            if (v) set.add(v);
          }
        }
        const emails = Array.from(set);
        this.companyEmails.set(emails);

        // Prefill form fields if empty
        if (emails.length && !this.form.controls.to.value) {
          this.form.controls.to.setValue(emails[0]);
        }
        if (normalizedTemplates.length && !this.form.controls.templateId.value) {
          const firstId = normalizedTemplates[0].id as any;
          this.form.controls.templateId.setValue(firstId as any);
          this.selectedTemplateId.set(firstId != null ? Number(firstId) : null);
        }
        if (!this.form.controls.scheduledAt.value) {
          const dt = new Date(Date.now() + 5 * 60 * 1000);
          this.form.controls.scheduledAt.setValue(toLocalDatetimeInputValue(dt));
        }

        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to load email templates or contacts');
      }
    });
  }

  retry() {
    this.load();
  }

  trackByTemplateId = (_: number, t: EmailTemplate) => t.id;

  submit() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { to, templateId, scheduledAt } = this.form.getRawValue();
    const t = this.templates().find(x => String(x.id) === String(templateId));
    if (!t) {
      this.error.set('Please choose a template.');
      return;
    }

    const subject = extractTemplateSubject(t);
    const content = extractTemplateContent(t);
    const cc = extractTemplateCc(t);
    if (!subject || !content) {
      this.error.set('Selected template is missing subject or content.');
      return;
    }

    const scheduled = toLocalWithOffset(scheduledAt);

    const url = `http://localhost:5146/api/emails/send`;
    const payload = {
      to,
      subject,
      cc,
      content,
      scheduledAt: scheduled,
    } as const;

    this.loading.set(true);
    this.http.post(url, payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to schedule email');
      }
    });
  }
}

function toLocalDatetimeInputValue(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

function toLocalWithOffset(localInput: string): string {
  // localInput like "2025-10-05T14:30" (no seconds). Convert to ISO with local offset, e.g. "+03:00".
  const d = new Date(localInput);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = '00';
  const tzMin = -d.getTimezoneOffset(); // e.g. +180 for +03:00
  const sign = tzMin >= 0 ? '+' : '-';
  const tzH = pad(Math.floor(Math.abs(tzMin) / 60));
  const tzM = pad(Math.abs(tzMin) % 60);
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}${sign}${tzH}:${tzM}`;
}

function extractTemplateSubject(t: EmailTemplate | null | undefined): string {
  if (!t) return '';
  const candidates = [t.subject, t.emailSubject, t.title, t.name];
  for (const v of candidates) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  // Heuristic: find any string prop whose key suggests subject/title/name
  for (const [k, v] of Object.entries(t)) {
    if (typeof v === 'string') {
      const key = k.toLowerCase();
      if (/(subject|title|name)$/.test(key) && v.trim()) return v.trim();
    }
  }
  return '';
}

function extractTemplateContent(t: EmailTemplate | null | undefined): string {
  if (!t) return '';
  const candidates = [t.body, t.content, t.html, t.emailBody, t.templateBody, t.emailContent, t.description];
  for (const v of candidates) {
    if (typeof v === 'string' && v.trim()) return v; // keep HTML as-is
  }
  // Heuristic: find any string prop whose key suggests html/body/content/template
  let fallback = '';
  for (const [k, v] of Object.entries(t)) {
    if (typeof v !== 'string') continue;
    const key = k.toLowerCase();
    if (/(html|body|content|template)/.test(key)) {
      // Prefer strings that look like HTML
      if (/[<>]/.test(v)) return v;
      // Otherwise keep the first reasonable long text as fallback
      if (!fallback && v.trim().length >= 10) fallback = v;
    }
  }
  return fallback;
}

function extractTemplateCc(t: EmailTemplate | null | undefined): string {
  if (!t) return '';
  const raw = t.cc ?? t.ccs ?? t.ccList ?? t.ccEmails;
  if (!raw) return '';
  if (Array.isArray(raw)) return raw.filter(x => !!x).join(',');
  if (typeof raw === 'string') return raw;
  return '';
}
