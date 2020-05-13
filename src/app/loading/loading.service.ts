import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";

@Injectable()
export class LoadingService {
  // Behaviour Subject remembers the last value emitted by the subject so any new subscribers are going to receive the last value or initial value
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {}

  showLoaderUntillCompleted<T>(obs$: Observable<T>): Observable<T> {
    return undefined;
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
