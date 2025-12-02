# 🎓 College Resource Hub

A web platform where students can upload, share, and download study materials like notes and previous year papers. Built to help students prepare for exams efficiently.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

## 💡 Problem It Solves

Finding quality study materials scattered across multiple WhatsApp groups is frustrating. This platform centralizes all resources in one searchable location.

## ✨ Features

- 📚 **Upload & Share** - Students can upload PDFs and images
- 🔍 **Smart Search** - Find resources by subject, semester, or keywords
- 📥 **Easy Download** - One-click download with tracking
- 📊 **Analytics** - Track which resources are most popular
- 🏷️ **Organization** - Filter by subject and semester

## 🛠️ Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.5.6
- Spring Data JPA
- Maven

**Database:**
- H2 (Development)
- PostgreSQL (Planned for production)

**Architecture:**
- RESTful API design
- MVC + Service layer pattern
- File system storage

## 📂 Project Structure
src/main/java/com/example/college_resource_hubb/
├── controller/          # REST API endpoints
│   └── ResourceController.java
├── model/              # Database entities
│   └── Resource.java
├── repository/         # Data access layer
│   └── ResourceRepository.java
├── service/            # Business logic
│   └── ResourceService.java
└── CollegeResourceHubbApplication.java

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ishekaa12/college-resource-hubb.git
cd college-resource-hubb


Run the application
bash
./mvnw spring-boot:run

Access the API
http://localhost:8080/api/resources/hello

Upload Resource (POST)
Endpoint: /api/resources/upload
Form Data:
title: String (required)
subject: String (required)
semester: Integer (required)
type: String (required) - "notes", "papers", or "other"
uploaderName: String (optional)
file: File (required) - PDF or image

Example using cURL:
curl -X POST http://localhost:8080/api/resources/upload \
  -F "title=Data Structures Unit 1" \
  -F "subject=Computer Science" \
  -F "semester=3" \
  -F "type=notes" \
  -F "uploaderName=Isheka" \
  -F "file=@notes.pdf"

Response:
{
  "id": 1,
  "title": "Data Structures Unit 1",
  "subject": "Computer Science",
  "semester": 3,
  "type": "notes",
  "fileName": "notes.pdf",
  "uploadDate": "2025-10-12T22:09:28",
  "downloadCount": 0
}

🎯 Current Status
Completed ✅

 Project setup with Spring Boot
 Database schema design
 File upload API
 Resource listing and retrieval
 Download functionality with tracking
 Search and filter endpoints

In Progress 🚧

 Frontend UI (HTML/CSS/JavaScript)
 User authentication
 Advanced search features

Planned 📋

 Comments and ratings
 User profiles
 PostgreSQL migration
 Cloud deployment
 Mobile responsive design

🧪 Testing
Use Postman or any API client to test endpoints:

Import this collection: [Coming soon]
Start the application
Test the /hello endpoint first
Try uploading a file
Retrieve and download resources

📸 Screenshots
Coming soon after frontend development
🤝 Contributing
This is a learning project, but feedback and suggestions are welcome!

Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit changes (git commit -m 'Add some AmazingFeature')
Push to branch (git push origin feature/AmazingFeature)
Open a Pull Request

📝 Lessons Learned
Building this project taught me:

REST API design principles
File handling in Spring Boot
JPA/Hibernate ORM
Maven dependency management
Git version control

📄 License
This project is for educational purposes.
👤 About Me
Isheka Singh

🎓 Computer Science Freshman
📍 India
💼 Looking for Summer 2026 internships
🌱 Learning: Java, Spring Boot, Web Development

Connect with me:

GitHub: @ishekaa12
LinkedIn: www.linkedin.com/in/isheka-singh-152264309
Email: ishekasingh26@gmail.com

⭐ Star this repo if you find it useful!
Built with ❤️ for students, by a student | October 2025



