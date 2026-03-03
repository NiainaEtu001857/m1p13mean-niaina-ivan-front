import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from './services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const expectedRole = route.data['role'];
  const tokenRole = auth.getRoleFromToken();

  console.log('Expected Role:', expectedRole);
  if (tokenRole !== expectedRole) {
    router.navigate(['']);
    return false;
  }



  return true;
};
