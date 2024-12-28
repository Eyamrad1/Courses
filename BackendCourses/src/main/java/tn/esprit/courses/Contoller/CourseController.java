package tn.esprit.courses.Contoller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.courses.Service.CourseService;
import tn.esprit.courses.entity.Course;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")

@AllArgsConstructor
public class CourseController {
    @Autowired
    CourseService courseService;

    private static final String baseUrl = "http://localhost:8080/images/";

    @PostMapping("/add-course")
    public ResponseEntity<?> addCourse(
            @RequestParam("image") MultipartFile imageFile,
            @ModelAttribute Course course) {
        try {
            Course savedCourse = courseService.AddCourse(course, imageFile);
            return ResponseEntity.ok(savedCourse);
        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add course: " + e.getMessage());
        }
    }

    @GetMapping("/retrieveAllCourses")
    public List<Course> retrieveAllCourses() {
        List<Course> courses = courseService.retrieveAllCourses();
        String baseUrl = "http://localhost:8080/images/";
        courses.forEach(course -> {
            String relativeImageUrl = course.getImageUrl();
            String fullImageUrl = baseUrl + relativeImageUrl;
            course.setImageUrl(fullImageUrl);
        });
        return courses;
    }

    @DeleteMapping("/deleteCourseById/{idCourse}")
    public String deleteCourseById(@PathVariable Integer idCourse) {
        courseService.deleteCourseById(idCourse);
        return "Course deleted successfully";
    }

    @GetMapping("/findByIdCourse/{idCourse}")
    public Course findById(@PathVariable Integer idCourse) {
        Course course = courseService.findById(idCourse);
        String relativeImageUrl = course.getImageUrl(); // Get the relative image URL from the event
        String fullImageUrl = baseUrl + relativeImageUrl; // Construct the full image URL

        // Update the event's image URL with the full URL
        course.setImageUrl(fullImageUrl);

        return course;
    }

    @PutMapping("/update-course/{idCourse}")
    public ResponseEntity<?> updateCourse(
            @PathVariable Integer idCourse,
            @RequestParam("image") MultipartFile imageFile,
            @ModelAttribute Course course) {
        try {
            // Call service method to update the course
            Course updatedCourse = courseService.updateCourse(course, idCourse, imageFile);
            return ResponseEntity.ok(updatedCourse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update course: " + e.getMessage());
        }
    }
}
