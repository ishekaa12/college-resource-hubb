package com.example.college_resource_hubb.repository;

import com.example.college_resource_hubb.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findBySubject(String subject);

    List<Resource> findBySemester(Integer semester);

    List<Resource> findBySubjectAndSemester(String subject, Integer semester);

    List<Resource> findByTitleContainingIgnoreCase(String keyword);
}

