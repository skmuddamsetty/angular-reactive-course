import { Component, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    // imperative style of calling the service
    // this.http.get("/api/courses").subscribe((res) => {
    //   const courses: Course[] = res["payload"].sort(sortCoursesBySeqNo);
    //   this.beginnerCourses = courses.filter(
    //     (course) => course.category == "BEGINNER"
    //   );
    //   this.advancedCourses = courses.filter(
    //     (course) => course.category == "ADVANCED"
    //   );
    // });
    this.reloadCourses_2();
  }

  reloadCourses() {
    this.loadingService.loadingOn();
    const courses$ = this.coursesService.loadAllCourses().pipe(
      map((courses) => courses.sort(sortCoursesBySeqNo)),
      // finalize is called when the current Observable i.e. loadAllCourses completes properly
      finalize(() => this.loadingService.loadingOff())
    );

    this.beginnerCourses$ = courses$.pipe(
      // returning new observable which contains the data with beginner courses using the map operator
      map((courses) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );
    this.advancedCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "ADVANCED")
      )
    );
  }

  reloadCourses_2() {
    const courses$ = this.coursesService.loadAllCourses().pipe(
      map((courses) => courses.sort(sortCoursesBySeqNo))
      // finalize is called when the current Observable i.e. loadAllCourses completes properly
      // finalize(() => this.loadingService.loadingOff())
    );

    const loadCourses$ = this.loadingService.showLoaderUntillCompleted(
      courses$
    );

    this.beginnerCourses$ = loadCourses$.pipe(
      // returning new observable which contains the data with beginner courses using the map operator
      map((courses) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );
    this.advancedCourses$ = loadCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "ADVANCED")
      )
    );
  }
}
