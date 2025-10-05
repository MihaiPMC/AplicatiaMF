import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent)
  },
  {
    path: 'events/:id/companies/:eventTypeId',
    loadComponent: () => import('./pages/events/event-companies.component').then(m => m.EventCompaniesComponent)
  },
  {
    path: 'events/:id/companies/:eventTypeId/contact/:companyId',
    loadComponent: () => import('./pages/events/contact-company.component').then(m => m.ContactCompanyComponent)
  },
  {
    path: 'companies',
    loadComponent: () => import('./pages/companies/companies.component').then(m => m.CompaniesComponent)
  },
  {
    path: 'interactions',
    loadComponent: () => import('./pages/interactions/interactions.component').then(m => m.InteractionsComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  { path: '**', redirectTo: '' }
];
