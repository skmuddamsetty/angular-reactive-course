import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Course } from "../model/course";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  /**
   * here we are returning Observable so that the data is not mutable
   */
  loadAllCourses(): Observable<Course[]> {
    // since the below statement does not know what type of data will be coming back from the service, we give the type of the data that we are expecting beside get
    return (
      this.http
        .get<Course[]>("/api/courses")
        // we are using map operator to transform the results to a new array
        .pipe(
          map((res) => res["payload"]),
          // shareReplay operator helps in not making calls again to the server if there are multiple subscriptions on the same observable ex: home.component.ts
          // shareReplay is only applicable for services in angular which use HttpClient
          shareReplay()
        )
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }
}
