import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
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
    this.course$ = this.coursesService.loadCourseById(courseId);
    this.lessons$ = this.coursesService.loadCourseLessons(courseId);
    // using combineLatest to combine the data of these two observables into one observable
    // Here there is no dependency between the observables i.e. one observable do not wait for the other observable to complete.
    // when any of the observable completes, the combinelatest method returns the data
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
