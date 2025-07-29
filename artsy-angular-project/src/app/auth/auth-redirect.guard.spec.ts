import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthRedirectGuard } from './auth-redirect.guard';

describe('authRedirectGuard', () => {
  const executeGuard: CanActivateFn = (route, state) => 
      TestBed.runInInjectionContext(() => {
        const guard = TestBed.inject(AuthRedirectGuard);
        return guard.canActivate(route, state);
      });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
