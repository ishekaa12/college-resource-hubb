package com.example.college_resource_hubb.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private Integer semester;

    private String type; // "notes", "papers", "other"

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String filePath;

    private Long fileSize;

    private String uploaderName;

    @Column(nullable = false)
    private LocalDateTime uploadDate;

    private Integer downloadCount = 0;

    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
    }
}