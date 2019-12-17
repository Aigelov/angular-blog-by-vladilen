import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';

import { FirebaseAuthResponse, User } from '../../../shared/interfaces';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
      environment.apiKey
    }
  `;

  constructor(
    private http: HttpClient
  ) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(this.url, user).pipe(
      tap(this.setToken)
    )
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(response: FirebaseAuthResponse | null): void {
    if (response) {
      const expDate = new Date(
        new Date().getTime() + +response.expiresIn * 1000
      );
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
