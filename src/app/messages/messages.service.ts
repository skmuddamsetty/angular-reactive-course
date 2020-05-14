import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesService {
  private subject = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> = this.subject.asObservable().pipe(
    // filter is like road block to the next step. observable chain proceeds to teh next step only if the filter is true
    filter((messages) => {
      return messages && messages.length > 0;
    })
  );

  constructor() {
    console.log("Messages Service Created!");
  }

  showErrors(...errors: string[]) {
    this.subject.next(errors);
  }
}
