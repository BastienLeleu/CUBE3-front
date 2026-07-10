import { Component, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  showMentionsLegales = signal(false);
  showCGU = signal(false);
  showPrivacy = signal(false);

  openMentionsLegales(event: Event): void {
    event.preventDefault();
    this.showMentionsLegales.set(true);
  }

  openCGU(event: Event): void {
    event.preventDefault();
    this.showCGU.set(true);
  }

  openPrivacy(event: Event): void {
    event.preventDefault();
    this.showPrivacy.set(true);
  }
}
