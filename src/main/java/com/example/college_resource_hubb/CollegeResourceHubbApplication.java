package com.example.college_resource_hubb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class CollegeResourceHubbApplication {

    public static void main(String[] args) {
        SpringApplication.run(CollegeResourceHubbApplication.class, args);
    }

    // CORS configuration must be inside the class
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Allow all origins (your phone) to access all endpoints
                registry.addMapping("/**").allowedOrigins("*");
            }
        };
    }
}
