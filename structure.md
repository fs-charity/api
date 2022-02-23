## Project Structure

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
[libs]                 -> Contain shared libraries
  - [email]            -> Contain email module
[config]               -> Contain the app config
```
## Module Structure

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