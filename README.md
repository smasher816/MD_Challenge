# MdChallenge

This project contains both a server and client implementation of a job queue REST API.
This API receives requests for the system to fetch a given url and store the results.
Clients can then use their request id to retrieve, edit, and delete the request.
By retrieving the request the server will respond with an html copy of the requested site if the job
is complete.

Both the server and client are written in Node.js, and thus require Node to be installed to function.
At the moment the client is a fairly bare bones command line interface that simply forms the required
HTTP requests for the user. In the future it could be expanded to a web page, an android app, or any
number of other clients that are capable of forming HTTP requests. Additionally, the server is also
bare, only implementing the required features for the challenge. User authentication, better logging,
etc could all easily be implemented on top of this base with a little bit of time and effort.
