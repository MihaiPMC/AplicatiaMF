// filepath: /Users/mihai/Desktop/ProiectMF/AplicatiaMF/FrontEnd/src/app/pages/companies/companies.component.ts
import { Component } from '@angular/core';

interface Company {
  name: string;
  contact: string;
  email: string;
  phone: string;
  lastInteraction: string;
}

@Component({
  selector: 'app-companies',
  standalone: true,
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent {
  companies: Company[] = [
    { name: 'Acme Corp', contact: 'Jane Smith', email: 'jane@acme.com', phone: '+40 721 000 111', lastInteraction: '2025-09-12' },
    { name: 'BetaSoft', contact: 'Ion Popescu', email: 'ion@betasoft.ro', phone: '+40 722 123 456', lastInteraction: '2025-08-30' },
    { name: 'CharityX', contact: 'Maria Ionescu', email: 'maria@charityx.org', phone: '+40 733 987 654', lastInteraction: '2025-07-18' },
  ];
}

