# Data Echo Server

This project is a React-based application that serves as an echo server. The application allows users to input API details such as the API path, API method, API response code, and headers. When these APIs are hit, they return the values that were input by the user.

The application is written in TypeScript and uses the Chakra UI library for its components. It also uses Redux for state management.

The application also includes a backend server written in Node.js with Express. The server code is located in the `backendNode/src/index.ts` file. This server includes several routes for managing API details and for the echo functionality.

Please note that the routes starting with `/api/des/*` are reserved for internal use and should not be called directly. These routes are used for managing the API details.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Auto-Generating UUIDs](#auto-generating-uuids)
3. [Running the Application](#running-the-application)
4. [DockerHub Repositories](#dockerhub-repositories)
5. [Application Screenshots](#application-screenshots)

## Getting Started

To get started with this project, you need to clone the repository and then run the `deploy.sh` script. Here are the steps:

```bash
git clone git@github.com:blance97/DataEchoServer.git
cd DataEchoServer
bash ./deploy.sh
```

bash ./deploy.sh

## Auto-Generating UUIDs

In this application, you can auto-generate UUIDs in the JSON response body. To do this, you can use the `${DES_UUID4}` placeholder in the value of a JSON object. For example, if you want to generate a UUID for a `test` field, you can set the value as follows:

```json
{
    "test": "${DES_UUID4}"
}
```



When the API is hit, the `${DES_UUID4}` placeholder will be replaced with a randomly generated UUID.
Like so:
```json
{
    "test": "f7b3b3b4-0b3b-4b3b-8b3b-0b3b3b3b3b3b"
}
```

## Running the Application
This script will check if the `dist` directory exists. If it doesn't, it will navigate into the `EchoServerReact` directory, install the necessary npm packages, and build the project. After that, it will start the Docker containers using `docker-compose up`.

This is a simplified description of the project. For more detailed information, refer to the individual files and their comments.

Running on Docker
To run the application on Docker, you need to have Docker installed on your machine. You can download Docker from the official website.
Run the dockerCompose.sh script to start the application. This script will build the Docker images and start the containers.

```bash
docker-compose up -d
```

This will spin up an nginx server that serves the React application and a Node.js server that serves the backend API. The React application will be available at http://localhost:8080.
You can use http://localhost:8080/* to hit the echo API.

## DockerHub Repositories
The Docker images for the frontend and backend are available on DockerHub. 

The frontend image is available at https://hub.docker.com/repository/docker/blance97/dataechoserver-frontend/general

The backend image is available at https://hub.docker.com/repository/docker/blance97/dataechoserver-backend/general

```bash
## Application Screenshots

Photos of the application can be found in the `assets` directory.

![mainScreen](assets/mainScreen.png)
![api](assets/api.png)
![sendReq](assets/sendReq.png)
![result](assets/result.png)

