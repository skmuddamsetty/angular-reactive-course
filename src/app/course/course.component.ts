import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  catchError,
} from "rxjs/operators";
import {
  merge,
  fromEvent,
  Observable,
  concat,
  throwError,
  combineLatest,
} from "rxjs";
import { Lesson } from "../model/lesson";
import { CoursesStore } from "../services/courses-store.service";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";

interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent implements OnInit {
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;
  data$: Observable<CourseData>;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));
    this.course$ = this.coursesService.loadCourseById(courseId).pipe(
      // startWith is going to emit the course observable with null for the first time and then it is going to emit the data that we got from the service
      startWith(null)
    );
    this.lessons$ = this.coursesService.loadCourseLessons(courseId).pipe(
      // startWith is going to emit the course observable with null for the first time and then it is going to emit the data that we got from the service
      startWith([])
    );
    // using combineLatest to combine the data of these two observables into one observable
    // combineLatest is going to wait for both the observables to complete for the first time
    // from second time combineLatest will return the observable with data from the observable that responds first
    // to overcome this problem we start both the observables to emit null for the first time as shown above using startsWith(null)
    this.loadingService.loadingOn();
    this.data$ = combineLatest([this.course$, this.lessons$]).pipe(
      tap(() => this.loadingService.loadingOff()),
      map(([course, lessons]) => {
        console.log(course, lessons);
        return {
          course,
          lessons,
        };
      })
    );
  }
}
