package com.example.college_resource_hubb.service;

import com.example.college_resource_hubb.model.Resource;
import com.example.college_resource_hubb.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    // Directory to store uploaded files
    private final String UPLOAD_DIR = "uploads/";

    public ResourceService() {
        // Create uploads directory if it doesn't exist
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }

    public Resource uploadResource(String title, String subject, Integer semester,
                                   String type, String uploaderName,
                                   MultipartFile file) throws IOException {

        // Generate unique filename
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String filePath = UPLOAD_DIR + fileName;

        // Save file to disk
        Path path = Paths.get(filePath);
        Files.write(path, file.getBytes());

        // Create resource object
        Resource resource = new Resource();
        resource.setTitle(title);
        resource.setSubject(subject);
        resource.setSemester(semester);
        resource.setType(type);
        resource.setFileName(file.getOriginalFilename());
        resource.setFilePath(filePath);
        resource.setFileSize(file.getSize());
        resource.setUploaderName(uploaderName);
        resource.setUploadDate(LocalDateTime.now());
        resource.setDownloadCount(0);

        // Save to database
        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id).orElse(null);
    }

    public void incrementDownloadCount(Long id) {
        Resource resource = resourceRepository.findById(id).orElse(null);
        if (resource != null) {
            resource.setDownloadCount(resource.getDownloadCount() + 1);
            resourceRepository.save(resource);
        }
    }
}