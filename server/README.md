# MdTest Server
This provides the server implementation of the MdTest REST API.

Note: Instead of manually managing a job queue all requests are ran asynchronously and managed behind
the scenes by Node's event queue.

## Installation
You will require MongoDB. If you do not have it yet, follow your OS's installation instructions.

Run `npm install` to download the necessary libraries.

## Configuration
Edit `config.js` and change the database URI to a different path if you are using an external database.
Also, consider changing the default port from 80 as programs require root permissions for ports under 1024.

## Usage
Make sure MongoDB is running. If it is not you may start it by making a folder called database and running
```mogod --dbpath ./database```

Run
```npm start```
to start the server.

Note: You may require elevated permissions depending on the port number you chose to use.

Clients may now connect and use the service.

## REST API
The API provides basic CRUD functionality for all requests.

HTTP Method | URL | Action
------------|-----|--------
POST | /request | Create a new request. (Requires a url paramater in the post)
GET | /request | Lists all requests
PUT | /request | UNUSED (no bulk edit on all data needed)
DEL | /request | Deletes all requests

POST | /request/# | UNUSED (currently nothing to add to a request)
GET | /request/# | Retreives a request
PUT | /request/# | Updates a request. (Requires a url parameter in the post)
DEL | /request/# | Deletes a request
