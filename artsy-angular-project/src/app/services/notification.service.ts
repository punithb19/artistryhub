import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum NotificationType {
  SUCCESS = 'success',
  DANGER = 'danger'
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();

  constructor() {}

  addNotification(message: string, type: NotificationType): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      timestamp: Date.now()
    };

    const currentNotifications = this.notifications.getValue();
    this.notifications.next([...currentNotifications, notification]);

    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 3000);
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notifications.getValue();
    this.notifications.next(
      currentNotifications.filter(notification => notification.id !== id)
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  addToFavorites(): void {
    this.addNotification('Added to favorites', NotificationType.SUCCESS);
  }

  removeFromFavorites(): void {
    this.addNotification('Removed from favorites', NotificationType.DANGER);
  }

  loggedOut(): void {
    this.addNotification('Logged out', NotificationType.SUCCESS);
  }

  accountDeleted(): void {
    this.addNotification('Account deleted', NotificationType.DANGER);
  }
}
