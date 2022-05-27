# Advanced GraphQL with Apollo (Source Code)

This repo contains the completed files for the federated GraphQL API built throughout the second edition of the *Advanced GraphQL with Apollo* book from 8-Bit Press.

**[Learn more about the book and download a sample chapter here.](https://8bit.press/book/advanced-graphql)**

## What's in the Book?

If you've covered the basics with GraphQL and have wondered, "alright, what's next?" then this book was written for you.

Advanced topics covered in the book include:

### Apollo Federation 2 and Apollo Gateway

For anything beyond a basic app it doesn't take long for a GraphQL API to balloon in size and throttle the speed of multi-team schema collaboration. Apollo Federation allows you to tame that beast by drawing sensible boundaries between services that each maintain their own subgraph schemas and then compose them together into a supergraph schema for use with Apollo Gateway or Apollo Router.

### Subgraph Schema Design

Real-world schema design for subgraphs often requires some advanced features of the Apollo Federation 2 specification, so we'll cover off best practices for using multiple key fields and compound key fields with entity types, as well as the `@requires` directive when creating computed fields.

### Authentication and Authorization with Auth0

Authentication and authorization are some of the trickiest things to get right in an app. Using [Auth0](https://auth0.com/) we'll set up user authentication in Express middleware and implement a series of custom type system directives to support field-level authorization for the API.

### Apollo Data Sources

Bloating resolver functions with data-fetching logic can be messy and often isn't very DRY. We'll use Apollo data sources to neatly encapsulate and organize data-fetching logic within each subgraph service.

### Relay-Style Pagination

[Relay-style pagination](https://facebook.github.io/relay/graphql/connections.htm) is a popular choice for paginating results in a GraphQL API, but implementing its specification from scratch isn't for the faint of heart! We'll build out a helper class step-by-step to paginate documents retrieved from MongoDB using the Relay pagination algorithm.

### Automatic Persisted Queries

Automatic Persisted Queries (APQs) help improve network performance by sending smaller hashed representations of a query operations to Apollo Server that can also easily be contained with the size constraints of `GET` requests.

### Batching with DataLoader

When left unchecked, nested GraphQL queries can put a significant strain on the data stores behind when resolving duplicate data for list fields. The [DataLoader](https://github.com/graphql/dataloader) library will allow us to batch requests to Auth0 and MongoDB and decrease the total number of requests per operation by an order of magnitude.

### Workflows with Temporal

Sometimes we need a way to coordinate multiple related mutations across subgraphs in a way that goes beyond the basic serial field execution provided by GraphQL for the `Mutation` type. To support cascading deletion of user accounts and related data across subgraphs, we'll create a workflow using [Temporal](https://temporal.io/) as an orchestrator.

### Managed Federation with Apollo Studio

We'll use the Rover CLI to publish subgraph schemas to Apollo Studio so we can use its registry as a source of truth for the supergraph schema as it evolves over time. We'll also explore additional features of Apollo Studio including schema checks and tracing.

### Apollo Router

 Every millisecond counts when it comes to graph performance. In the final chapter of the book, we'll swap out the JavaScript-based Apollo Gateway with the next-gen, Rust-based Apollo Router. No prior experience with Rust is required!

## What Does All the Code in This Repo Do?

The book takes a hands-on approach to learning advanced GraphQL concepts by building the back-end and front-end of a microblogging app called DevChirps from scratch (the code you see here!).

DevChirps users can write posts and reply to them, add images to their posts and replies, follow other users, and search for content and users with a full-text search. Users with a moderator role can block content and other user accounts.

Users who sign up for DevChirps with a GitHub account can showcase pinned repos and gists on their profile too.

## About the Author

Mandi Wise discovered her love for building web things 20 years ago. She has spent the last seven years sharing that passion by teaching software development to others, including how to build web and mobile applications that are powered by GraphQL APIs. She currently leads the Solutions Architecture team at [Apollo Graph Inc.](https://www.apollographql.com/). You can find her on [GitHub](https://github.com/mandiwise) and [Twitter](https://twitter.com/mandiwise).

## Questions & Feedback

Email [hello@8bit.press](mailto:hello@8bit.press) if you have any questions or feedback about this book.

---

Copyright © 2022 8-Bit Press Inc.
