import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TimeAgoService {
  private timer$ = new BehaviorSubject<number>(Date.now());

  constructor() {
    setInterval(() => this.timer$.next(Date.now()), 1000);
  }

  getRelativeTime(addedDate: Date): Observable<string> {
    return this.timer$.pipe(
      map(() => this.calculateTimeDifference(addedDate))
    );
  }

  private calculateTimeDifference(addedDate: Date): string {
    const seconds = Math.floor((Date.now() - addedDate.getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
      }
    }
    
    return 'Just now';
  }
}
