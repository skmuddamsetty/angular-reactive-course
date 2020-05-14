import { Injectable } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    console.log("CoursesStore Created");
    this.loadAllCourses();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      catchError((err) => {
        const message = "Could not load courses!";
        this.messagesService.showErrors(message);
        console.log(message, err);
        // throwError is an observable and will terminate the observable chain after emitting the err
        return throwError(err);
      }),
      tap((courses) => this.subject.next(courses))
    );
    this.loadingService.showLoaderUntillCompleted(loadCourses$).subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save course!";
        console.log(message, err);
        this.messagesService.showErrors(message);
        return throwError(err);
      })
    );
  }
}
