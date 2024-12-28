import {Component, OnInit} from '@angular/core';
import {Course} from '../../../models/course';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CourseService} from '../../../service/course.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-course-update',
  standalone: true,
  imports: [ReactiveFormsModule,MatIconModule,
    MatButtonModule,
    MatTooltipModule,],
  templateUrl: './course-update.component.html',
  styleUrl: './course-update.component.css'
})
export class CourseUpdateComponent implements  OnInit{
  courseForm: FormGroup;
  selectedImage: File | null = null;
  idCourse: number;

  constructor(
      private fb: FormBuilder,
      private courseService: CourseService,
      private route: ActivatedRoute,
      private router: Router,
      private snackBar: MatSnackBar
  ) {
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
    this.idCourse = 0; // Default value
  }

  ngOnInit(): void {
    // Get the course ID from the route
    this.idCourse = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idCourse) {
      this.loadCourseDetails();
    } else {
      console.error('Invalid course ID');
    }
  }

  loadCourseDetails(): void {
    this.courseService.getCourse(this.idCourse).subscribe(
        (course: Course) => {
          this.courseForm.patchValue({
            courseName: course.courseName,
            price: course.price,
          });
        },
        (error) => {
          console.error('Failed to load course details', error);
        }
    );
  }

  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  updateCourse(): void {
    if (this.courseForm.invalid) {
      console.error('Form is invalid:', this.courseForm.errors);
      return;
    }

    const formData = new FormData();
    formData.append('courseName', this.courseForm.value.courseName);
    formData.append('price', this.courseForm.value.price);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    console.log('Sending data to update course:', formData);

    this.courseService.updateCourse(this.idCourse, formData).subscribe(
        (updatedCourse: Course) => {
          console.log('Course updated successfully:', updatedCourse);
          this.snackBar.open('Course updated successfully!', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/admin/courseList']);
        },
        (error) => {
          console.error('Failed to update course:', error);
          this.snackBar.open('Failed to update course. Please try again.', 'Close', {
            duration: 3000,
          });
        }
    );
  }
  cancel(): void {
    this.router.navigate(['/admin/courseList']);
  }
}
