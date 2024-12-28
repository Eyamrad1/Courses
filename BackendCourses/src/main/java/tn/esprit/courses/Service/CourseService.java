package tn.esprit.courses.Service;

import org.springframework.web.multipart.MultipartFile;
import tn.esprit.courses.entity.Course;

import java.util.List;

public interface CourseService {

    public Course AddCourse(Course course, MultipartFile imageFile);

    public void deleteCourseById(Integer idCourse);

    public Course findById(Integer idCourse);

    public List<Course> retrieveAllCourses();

    public Course updateCourse(Course course, Integer idCourse , MultipartFile imageFile);
}
