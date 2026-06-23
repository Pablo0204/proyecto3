import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="page-container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .page-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px;
    }
  `],
})
export class AppComponent {}
