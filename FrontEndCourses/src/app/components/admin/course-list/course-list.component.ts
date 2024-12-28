import { Component, OnInit } from '@angular/core';
import { Course } from '../../../models/course';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../../service/course.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {AppModule} from '../../../app.module';

@Component({
    selector: 'app-course-list',
    standalone: true,
    imports: [CommonModule, MatIconModule,
        MatButtonModule,
        MatTooltipModule],
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.css'],
})
export class CourseListComponent implements OnInit {
    courses: Course[] = [];
    paginatedCourse: Course[] = [];
    currentPage: number = 0;
    pageSize: number = 4;
    totalPages: number = 0;

    constructor(
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        public courseService: CourseService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadCourses();
    }

    loadCourses(): void {
        this.courseService.getAllCourses().subscribe(
            (data: Course[]) => {
                this.courses = data;
                this.totalPages = Math.ceil(this.courses.length / this.pageSize);
                this.updatePaginatedCourse();
                console.log(this.courses); // Check if data is correctly populated
            },
            (error) => {
                console.error('Error loading courses', error);
            }
        );
    }

    updatePaginatedCourse(): void {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedCourse = this.courses.slice(startIndex, endIndex);
    }

    previousPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updatePaginatedCourse();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.updatePaginatedCourse();
        }
    }

    confirmDelete(course: Course): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: { action: 'delete', item: 'course' },
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.deleteCourse(course);
                window.location.reload();
                this.snackBar.open('Course deleted successfully!', 'Close', { duration: 7000 });
            }
        });
    }

    navigateToAddCourse(): void {
        this.router.navigate(['/admin/course']);
    }

    navigateToUpdateCourse(course: Course): void {
        if (course && course.idCourse) {
            this.router.navigate(['/admin/courseUpdate', course.idCourse]);
        }
    }

    deleteCourse(course: Course): void {
        if (course && course.idCourse) {
            const idCourse = course.idCourse;
            this.courseService.deleteCourse(idCourse).subscribe(
                () => {
                    console.log('Course deleted successfully');
                    this.loadCourses(); // Refresh the courses list
                },
                (error: HttpErrorResponse) => {
                    console.error('Error deleting course', error);
                    // Handle error appropriately
                }
            );
        }
    }
}
