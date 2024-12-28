import { Component, OnInit } from "@angular/core";
import {Course} from '../../models/course';
import {CourseService} from '../../service/course.service';

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
})
export class LandingComponent implements OnInit {
  courses: Course[] = [];
  constructor(private courseService:CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }
  loadCourses(): void {
    this.courseService.getAllCourses().subscribe(
        (data: Course[]) => {
          this.courses = data;
          console.log(this.courses); // Check if data is correctly populated
        },
        (error) => {
          console.error('Error loading courses', error);
        }
    );
  }

}
