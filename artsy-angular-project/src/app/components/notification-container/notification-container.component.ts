import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  template: `
    <div class="notification-container">
      <app-notification
        *ngFor="let notification of notifications"
        [notification]="notification"
        (close)="closeNotification($event)"
      ></app-notification>
    </div>
  `,
  styles: [`
    .notification-container {
      padding-top: 40px;
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class NotificationContainerComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = [...notifications].sort((a, b) => a.timestamp - b.timestamp);
    });
  }

  closeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }
}
