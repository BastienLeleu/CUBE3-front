import { Component, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);


  logout(): void {
    this.authService.logout();
  }
}
