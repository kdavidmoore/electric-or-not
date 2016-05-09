# Electric or Not

## Voting app built in Node.js using Express

This is a single page app that allows the user to vote on images and view total votes. It creates votes associated with a particular IP address by performing CRUD operations on a MongoDB database.

## Features
* Vote on photos and store votes in a MongoDB database
* New votes creates a new document under the users collection
* New votes also updates the totalVotes field for a given document under the cars collection
* Displays total votes on the Standings page (negative is bad, positive is good)
* Resets votes by removing the totalVotes field and dropping the users collection

## [Demo here](http://kdavidmoore.com:3060)

## Installation Instructions
First clone the repo into a new directory:
```git clone https://github.com/kdavidmoore/electric-or-not electric-app
```

Then change directories and install npm dependencies:
```cd electric-app && npm install
```

[I learned this at DigitalCrafts](https://digitalcrafts.com)