### Project Structure

```
[src]
  - main.ts            -> Main app start here
  - [modules]          -> Contain the endpoints
    - [users]             -> Users endpoint
    - [auth]              -> Auth endpoints
    - [cases]             -> Cases endpoints
    - [reports]           -> Reports endpoints
    - [actions]           -> Actions endpoints
  - [utils]            -> Contain non-app-specific utility functions
  - [common]           -> Contain app-specific classes
    - [pipes]             -> Transformation classes
    - [middlewares]       -> Middleware class/functions
    - [interceptors]      -> Nest Interceptor classes
    - [filters]           -> Exception filters
    - [guards]            -> Guard classes
    - [decorators]        -> Decorators
    - [validators]        -> Validators
[libs]                 -> Contain shared libraries
  - [config]               -> Contain the app config
  - [email]            -> Contain email module
```
### Module Structure

```
[users]
  - users.module.ts       -> Module entrypoint
  - users.controller.ts   -> Module route controller
  - users.service.ts      -> Module services
  - [entities]            -> Entities
    - user.entity.ts         -> User entity
  - [dto]                 -> Data Transfer Objects
    - create-user.dto.ts     -> Create user DTO
    - update-user.dto.ts     -> Create user DTO
```

### CRUD

Create, Read, Update, Delete
  -> Four functions that are necessary to implement a persistent storage application.

### HTTP Methods

HTTP defines a set of request methods to indicate the desired action to be performed for a given resource. 

The primary or most commonly-used HTTP methods are POST, GET, PUT, PATCH, and DELETE. These methods correspond to create, read, update, and delete (or CRUD) operations, respectively.

```
  Method  | Crud Operation  
  ------- | ---------------
  GET     | Read
  POST    | Create
  PATCH   | Update (Partial)
  DELETE  | Delete 
  PUT     | Update/Replace     
```

For more information: Read [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)