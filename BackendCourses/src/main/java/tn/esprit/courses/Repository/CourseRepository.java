package tn.esprit.courses.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.courses.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course,Integer> {
}
