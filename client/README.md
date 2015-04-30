# MdTest Client
This provides a sample client implementation of the MdTest REST API in the form of a command line utility.

## Installation
Run
```
npm install
```
to download the necessary libraries.

## Example Usage
To use the script please run
```
node client.js
```
which will provide the command line options

To create a request for http://example.com, run
```
node client.js -c 'http://example.com'
```

which will return a requestID such as 554205d74e4d0beb1ed3de4c.
This request ID can be used in other commands.

To view the status or result of the request run
```
node client.js -r 554205d74e4d0beb1ed3de4c
```

To delete the request run
```
node client.js -d 554205d74e4d0beb1ed3de4c
```

To change the url of the request to http://www.google.com, run
```
node client.js -u 554205d74e4d0beb1ed3de4c --url 'http://www.google.com'
```

To list all requests run
```
node client.js -l
```

To delete all requests run
```
node client.js -w
```

Note: If you are not running the server on localhost:80, then you will have to add `-s 'SERVERIP:PORT'`
to all the commands above.
