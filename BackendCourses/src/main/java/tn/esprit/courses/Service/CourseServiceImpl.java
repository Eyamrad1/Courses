package tn.esprit.courses.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.courses.Repository.CourseRepository;
import tn.esprit.courses.entity.Course;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class CourseServiceImpl implements  CourseService{
    @Autowired
    CourseRepository courseRepository;

    public static final String uploadDirectory = "C:/xampp/htdocs/images/";

    @Override
    public Course AddCourse(Course course, MultipartFile imageFile) {
        try {
            Path directoryPath = Paths.get(uploadDirectory);
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }
            String originalFilename = imageFile.getOriginalFilename();
            String fileName = UUID.randomUUID().toString() + "_" + originalFilename;

            Path filePath = Paths.get(uploadDirectory, fileName);

            Files.write(filePath, imageFile.getBytes());

            course.setImageUrl(fileName);



            return courseRepository.save(course);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to upload image");
        }
    }

    @Override
    public void deleteCourseById(Integer idCourse) {
        courseRepository.deleteById(idCourse);
    }

    @Override
    public Course findById(Integer idCourse) {
        return courseRepository.findById(idCourse).orElse(null);
    }

    @Override
    public List<Course> retrieveAllCourses() {
        List<Course> listCourses = courseRepository.findAll();
        return listCourses;
    }

    @Override
    public Course updateCourse(Course course, Integer idCourse, MultipartFile imageFile) {
        Course existingCourse = courseRepository.findById(idCourse).orElse(null);

        if (existingCourse == null) {
            throw new RuntimeException("Course not found");
        }

        // Update course fields
        existingCourse.setCourseName(course.getCourseName());
        existingCourse.setPrice(course.getPrice());


        // If a new image is uploaded, process it
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                // Remove the old image
                if (existingCourse.getImageUrl() != null) {
                    Path oldImagePath = Paths.get(uploadDirectory, existingCourse.getImageUrl());
                    Files.deleteIfExists(oldImagePath);
                }

                // Create the directory
                Path directoryPath = Paths.get(uploadDirectory);
                if (!Files.exists(directoryPath)) {
                    Files.createDirectories(directoryPath);
                }

                // Generate a unique filename for the new image
                String originalFilename = imageFile.getOriginalFilename();
                String fileName = UUID.randomUUID().toString() + "_" + originalFilename;

                // Save the new image
                Path filePath = Paths.get(uploadDirectory, fileName);
                Files.write(filePath, imageFile.getBytes());

                // Update the imageUrl in the database
                existingCourse.setImageUrl(fileName);
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to upload image");
            }
        }

        // Save and return the updated course
        return courseRepository.save(existingCourse);
    }




}
