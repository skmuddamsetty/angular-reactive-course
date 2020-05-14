import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { tap, concatMap, finalize } from "rxjs/operators";

@Injectable()
export class LoadingService {
  // Behaviour Subject remembers the last value emitted by the subject so any new subscribers are going to receive the last value or initial value
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
    console.log("Loading Service Created!");
  }

  showLoaderUntillCompleted<T>(obs$: Observable<T>): Observable<T> {
    // triggering the initial observable using of(null) which emits null and completes immediately
    // we used of(null) just to create an observable chain so that we chain multiple operators
    return of(null).pipe(
      // using tap tp create a side effect
      tap(() => this.loadingOn()),
      // using concatMap we are switching from of(null) observable (which has emitted null value and completed immediately) to the observable that is passed in
      // with this this method start returning the values from the input observable for ex: courses$ in home.component.ts
      concatMap(() => obs$),
      // finalize is called only when the input observable has completed for ex: courses$ in home.component.ts
      finalize(() => this.loadingOff())
    );
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
