package com.example.college_resource_hubb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*",allowedHeaders = "*")
public class ResourceController {

    @Autowired
    private ResourceRepository repository;

    private final String UPLOAD_DIR = "uploads/";

    // Test endpoint
    @GetMapping("/hello")
    public String hello() {
        return "API Working! 🚀";
    }

    // Get all resources
    @GetMapping("/resources")
    public List<Resource> getAll() {
        return repository.findAll();
    }

    // Upload file
    @PostMapping("/upload")
    public Resource upload(
            @RequestParam("title") String title,
            @RequestParam("subject") String subject,
            @RequestParam("semester") Integer semester,
            @RequestParam("file") MultipartFile file) throws IOException {

        // Create upload directory
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) dir.mkdirs();

        // Save file
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + fileName);
        Files.write(path, file.getBytes());

        // Save to database
        Resource resource = new Resource();
        resource.setTitle(title);
        resource.setSubject(subject);
        resource.setSemester(semester);
        resource.setFileName(file.getOriginalFilename());
        resource.setFilePath(UPLOAD_DIR + fileName);
        resource.setFileSize(file.getSize());

        return repository.save(resource);
    }

    // Download file
    @GetMapping("/download/{id}")
    public ResponseEntity<FileSystemResource> download(@PathVariable Long id) {
        Resource resource = repository.findById(id).orElse(null);

        if (resource == null) {
            return ResponseEntity.notFound().build();
        }

        File file = new File(resource.getFilePath());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + resource.getFileName());

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new FileSystemResource(file));
    }
}
