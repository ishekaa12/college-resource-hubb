package com.example.college_resource_hubb.controller;

import com.example.college_resource_hubb.model.Resource;
import com.example.college_resource_hubb.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ResourceController {
    @Autowired
    private ResourceService resourceService;
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("CORS is working!");
    }

    @GetMapping("/hello")
    public String hello() {
        return "College Resource Hub API is running! 🎓";
    }

    // Upload new resource
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadResource(
            @RequestParam("title") String title,
            @RequestParam("subject") String subject,
            @RequestParam("semester") Integer semester,
            @RequestParam("type") String type,
            @RequestParam(value = "uploaderName", required = false, defaultValue = "Anonymous") String uploaderName,
            @RequestParam("file") MultipartFile file) {

        try {
            Resource resource = resourceService.uploadResource(
                    title, subject, semester, type, uploaderName, file
            );
            return ResponseEntity.ok(resource);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    // Get all resources
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        List<Resource> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }

    // Get resource by ID
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);
        if (resource != null) {
            return ResponseEntity.ok(resource);
        }
        return ResponseEntity.notFound().build();
    }

    // Download file
    @GetMapping("/download/{id}")
    public ResponseEntity<FileSystemResource> downloadFile(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);

        if (resource == null) {
            return ResponseEntity.notFound().build();
        }

        File file = new File(resource.getFilePath());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        // Increment download count
        resourceService.incrementDownloadCount(id);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + resource.getFileName() + "\"");

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new FileSystemResource(file));
    }
}