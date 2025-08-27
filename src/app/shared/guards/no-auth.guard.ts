import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { first, map } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const router: Router = inject(Router);

  const authService = inject(AuthService);

  return authService.authenticated$.pipe(
    first(),
    map((authenticated) => {
      if (authenticated) {
        return router.parseUrl(`/`);
      }
      return true;
    })
  );
};