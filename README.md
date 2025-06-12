# Social App

## Project description

**Social App** is a full-featured social networking application built using the **MERN Stack**.

It allows users to:
- create accounts,
- publish posts,
- comment, like posts and comments, and follow other users,
- upload profile pictures and post images,
- receive notifications thanks to the built-in notification system.

User image files are **stored on the Express server**, while their URL paths are saved in the MongoDB database.

---

## How to run the application (Docker compose)

### Requirements

- Installed [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

1. Clone the repository:
   ```bash```
   git clone https://github.com/wintryquip/social-app.git
   cd social-app
2. Start the containers:
   ```bash```
   docker compose up --build -d
3. Launch application
   http://localhost:3000

API server runs at:
http://localhost:8080

---

## Tech Stack
- **Frontend**: React + Bootstrap
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Docker**: for running the whole environment
- **File storage**: Server's local file system