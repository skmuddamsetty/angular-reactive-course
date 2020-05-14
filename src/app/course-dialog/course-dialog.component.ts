import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CoursesStore } from "../services/courses-store.service";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [LoadingService, MessagesService],
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesService: MessagesService,
    private coursesStore: CoursesStore
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  save_without_loading_indicator() {
    const changes = this.form.value;
    this.coursesService
      .saveCourse(this.course.id, changes)
      .pipe(
        catchError((err) => {
          const message = "Could not save course!";
          console.log(message, err);
          this.messagesService.showErrors(message);
          return throwError(err);
        })
      )
      .subscribe((val) => {
        this.dialogRef.close(val);
      });
  }

  save_with_loading_indicator() {
    const changes = this.form.value;
    const saveCourse$ = this.coursesService
      .saveCourse(this.course.id, changes)
      .pipe(
        catchError((err) => {
          const message = "Could not save course!";
          console.log(message, err);
          this.messagesService.showErrors(message);
          return throwError(err);
        })
      );
    this.loadingService
      .showLoaderUntillCompleted(saveCourse$)
      .subscribe((val) => {
        this.dialogRef.close(val);
      });
  }

  save_with_course_store_optimistic() {
    const changes = this.form.value;
    console.log(changes, this.course.id);
    this.coursesStore
      .saveCourse(this.course.id, changes)
      .pipe(
        // error handling here is of no use because we close the modal on line 103 without waiting for the service to respond
        // so this error is handled in coursesStore.saveCourse method
        catchError((err) => {
          const message = "Could not save course!";
          console.log(message, err);
          this.messagesService.showErrors(message);
          return throwError(err);
        })
      )
      .subscribe();
    this.dialogRef.close(changes);
  }

  close() {
    this.dialogRef.close();
  }
}
