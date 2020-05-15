import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Course } from "../model/course";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { filter, tap } from "rxjs/operators";

@Component({
  selector: "courses-card-list",
  templateUrl: "./courses-card-list.component.html",
  styleUrls: ["./courses-card-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoursesCardListComponent implements OnInit {
  @Input()
  courses: Course[] = [];
  @Output()
  private coursesChanged = new EventEmitter();
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
    dialogRef
      .afterClosed()
      .pipe(
        // added this filter because there are two scenarios the user can trigger this when the modal is opened i.e either by clicking edit or save
        // when the edit is clicked the incoming value from the close event is empty and if it is empty we do not want to run the tap operator that is the side effect of emitting the event
        // but when this event is triggered after save, the value will not be empty, so the tap operator gets executed.
        // filter is like road block to the next step. observable chain proceeds to teh next step only if the filter is true
        filter((val) => !!val),
        // using the tap operator to cause the side effect of emitting the output event
        tap(() => this.coursesChanged.emit())
      )
      .subscribe();
  }
}
