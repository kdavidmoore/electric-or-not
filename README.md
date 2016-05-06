# Electric or Not

The initial version of the Electric or Not app is built in Node.js using Express. It also performs CRUD operations on a MongoDB database.

## Features
* Vote on photos and store votes in a MongoDB database
* New votes creates a new document under the users collection
* New votes also updates the totalVotes field for a given document under the cars collection
* Displays total votes on the Standings page (negative is bad, positive is good)
* Resets votes by removing the totalVotes field and dropping the users collection

## [Demo here](http://kdavidmoore.com:3060)

[I learned this at DigitalCrafts](https://digitalcrafts.com)