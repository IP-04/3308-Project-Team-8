# 3308-Project-Team-8
BookHive strives to host a community of users who share and discover books together.

## Brief Application Description
Bookhive is a community-driven platform for book lovers to explore, review, and recommend their favorite reads. Like Goodreads or Letterboxd, users can upload and read reviews for a wide selection of books. With a privacy feature allowing reviews to be shared only with approved friends, Bookhive creates a personalized, social experience. A recommendation algorithm suggests books based on both user and friend preferences, while samples of each book are available to preview. Bookhive creates a welcoming environment for readers to discover new titles and share their literary passions with like-minded individuals.

## Contributors
- Isaias Perez  
- Ryan O'Leary  
- Zach Dyre  
- Zariyat Hossain  
- Abdirahman Ebiso

## Technology Stack
BookHive uses the following technologies:
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Express.js  
- Database: PostgreSQL 
- Deployment: Render (Cloud Host)
- Version Control: Git and GitHub  
- Testing Framework: Mocha

## Prerequisites to Run the Application
Before running the application, ensure the following are installed:
- Node.js (version 16 or later)
- npm (Node Package Manager)
- Git

## Instructions on How to Run the Application Locally
Follow these steps to run BookHive locally:

1. Clone the repository:
   git clone https://github.com/your-repo/3308-Project-Team-8.git

2. Navigate to the project directory:
    cd 3308-Project-Team-8\ProjectSourceCode

3. Run the application:
   docker compose up

4. Open your browser and navigate to http://localhost:3000 to access the application.

## How to run the tests

1. Ensure Dependencies are Installed

you can do this by running: npm install

2. Set Up Environment Variables

Ensure that the required environment variables are set up in a .env file in the ProjectSourceCode directory. 
The .env file should contain the following variables:

# database credentials
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="pwd"
POSTGRES_DB="users_db"

# Node vars
SESSION_SECRET="super duper secret!"
API_KEY="AIzaSyCxFtHLmyNWpIBAKOuH57lLyJQRWA4YcVM"

3. Run the Tests

Use the npm test command to run the tests. 

npm test

## Link to the deployed application

https://three308-project-team-8.onrender.com/​
