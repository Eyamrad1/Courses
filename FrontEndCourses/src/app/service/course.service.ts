import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Course} from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8080';
  imageBaseUrl = 'http://localhost:8080/'
  constructor(private http:HttpClient) { }

  AddCourse(eventData: FormData): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/add-course`, eventData);
  }
  updateCourse(idCourse: number, courseData: FormData): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/update-course/${idCourse}`, courseData);
  }


  getCourse(idCourse: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/findByIdCourse/${idCourse}`);
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/retrieveAllCourses`);
  }
  deleteCourse(idCourse: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteCourseById/${idCourse}`);
  }
    getImageUrl(imagePath: string): string {
        return this.imageBaseUrl + imagePath;
    }
}
