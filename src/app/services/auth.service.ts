import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { User } from "../model/user";
import { HttpClient } from "@angular/common/http";
import { map, shareReplay, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private subject = new BehaviorSubject<User>(null);
  user$: Observable<User> = this.subject.asObservable();
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    console.log("AuthStore Created!");
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>("/api/login", { email, password })
      .pipe(
        shareReplay(),
        tap((user) => this.subject.next(user))
      );
  }

  logout() {
    return this.subject.next(null);
  }
}
