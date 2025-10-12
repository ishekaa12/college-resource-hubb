# 🎓 College Resource Hub

A web platform for students to share and access study materials, notes, and previous year papers.

## ✨ Features

- 📚 Upload and share notes (PDF, images)
- 🔍 Search resources by subject, semester, or keyword
- 📥 Download study materials
- 🏷️ Organize by subject and semester
- 📊 Track download statistics

## 🛠️ Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.5.6
- Spring Data JPA
- H2 Database (Development)
- Maven

**Planned:**
- Frontend: HTML, CSS, JavaScript
- Production DB: PostgreSQL

## 📂 Project Structure
src/
├── main/
│   ├── java/com/example/college_resource_hubb/
│   │   ├── controller/     # REST API endpoints
│   │   ├── model/          # Database entities
│   │   ├── repository/     # Data access layer
│   │   ├── service/        # Business logic
│   │   └── CollegeResourceHubbApplication.java
│   └── resources/
│       └── application.properties

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/college-resource-hubb.git
cd college-resource-hubb
