# Running Microservices Locally with Docker Compose

This project uses Docker Compose to run the backend services locally. It includes:
- **User Service** (Port: 5001)
- **Blog Service** (Port: 5002)
- **MongoDB** (Port: 27017)

## Prerequisites

To run this project locally, you need to have the following installed:

- Docker
- Docker Compose

## Getting Started

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
https://github.com/ayishanajlaa/blogging-platform.git
cd blogging-platform


2. Build and Start the Services

docker-compose up
This will:

Build the services defined in the docker-compose.yml file.
Start the User Service (port 5001), Blog Service (port 5002), and MongoDB (port 27017).
Ports:
User Service: http://localhost:5001
Blog Service: http://localhost:5002
MongoDB: mongodb://localhost:27017



