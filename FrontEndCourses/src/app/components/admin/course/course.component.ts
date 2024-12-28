import { Component, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms'; // Import FormsModule
import { CourseService } from '../../../service/course.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-course',
  standalone: true, // Standalone component
  imports: [FormsModule], // Add FormsModule here
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent {
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  @ViewChild('courseForm') courseForm!: NgForm;

  constructor(
      private courseService: CourseService,
      private snackBar: MatSnackBar,
      private router: Router
  ) {}

  onSubmit(courseForm: NgForm): void {
    if (!courseForm.valid) return;

    const formData = new FormData();
    formData.append('courseName', courseForm.value.courseName);
    formData.append('price', courseForm.value.price);

    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.courseService.AddCourse(formData).subscribe({
      next: (response) => {
        this.snackBar.open('Course added successfully!', 'Close', {
          duration: 5000,
        });
        this.router.navigate(['/admin/courseList']);
        this.resetForm();
      },
      error: (err) => console.error('Error adding course', err),
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => (this.imagePreview = e.target?.result);
      reader.readAsDataURL(file);
    }
  }

  resetForm(): void {
    this.courseForm.resetForm();
    this.imagePreview = null;
    this.selectedFile = null;
  }
}
