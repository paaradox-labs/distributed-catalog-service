# Catalog Service

A microservice for managing product catalogs in a multi-tenant food ordering system. Built with Express, TypeScript, MongoDB, Kafka, and AWS S3.

## Tech Stack

| Layer        | Technology                                                      |
|-------------|-----------------------------------------------------------------|
| Runtime     | Node.js (v24.10.0)                                              |
| Language    | TypeScript                                                      |
| Framework   | Express v5                                                      |
| Database    | MongoDB via Mongoose + `mongoose-aggregate-paginate-v2`         |
| Auth        | JWKS-based (express-jwt + jwks-rsa)                             |
| Messaging   | Apache Kafka via KafkaJS                                        |
| Storage     | AWS S3 (@aws-sdk/client-s3)                                     |
| Validation  | express-validator                                               |
| Testing     | Jest + ts-jest + Supertest                                      |
| Logging     | Winston                                                        |
| Config      | node-config (YAML)                                              |

## Project Structure

```
src/
├── server.ts              # Entry point
├── app.ts                 # Express app setup
├── category/              # Categories domain (CRUD)
├── product/               # Products domain (CRUD + pagination + filtering)
├── topping/               # Toppings domain (CRUD + Kafka events)
├── common/                # Shared middleware, types, services
│   ├── middlewares/       # Auth, authorization, error handling
│   ├── services/          # S3 storage service
│   ├── factories/         # Kafka producer singleton factory
│   └── utils/             # Async wrapper helpers
└── config/                # DB, logger, kafka, pagination config
```

## API Endpoints

### Categories
| Method | Path                          | Auth | Role  | Description        |
|--------|-------------------------------|------|-------|--------------------|
| POST   | `/categories`                 | Yes  | ADMIN | Create category    |
| GET    | `/categories`                 | No   | --    | List categories    |
| GET    | `/categories/:categoryId`     | No   | --    | Get category by ID |
| PATCH  | `/categories/:id`             | Yes  | ADMIN | Update category    |

### Products
| Method | Path                           | Auth | Role          | Description         |
|--------|-------------------------------|------|---------------|---------------------|
| POST   | `/products`                    | Yes  | ADMIN/MANAGER | Create product      |
| PUT    | `/products/:productId`         | Yes  | ADMIN/MANAGER | Update product      |
| GET    | `/products`                    | No   | --            | List products       |

Query params for `GET /products`: `q`, `tenantId`, `categoryId`, `isPublish`, `page`, `limit`.

### Toppings
| Method | Path            | Auth | Role          | Description    |
|--------|----------------|------|---------------|----------------|
| POST   | `/toppings`     | Yes  | ADMIN/MANAGER | Create topping |
| GET    | `/toppings`     | No   | --            | List toppings  |

## Getting Started

```bash
nvm use
npm install
npm run dev          # starts on port 5502
```

## Prerequisites

- MongoDB (default: `mongodb://root:root@localhost:27017/catalog_db`)
- Kafka broker (default: `localhost:9092`)
- AWS S3 bucket
- Auth service at `http://localhost:5501/.well-known/jwks.json`

## Scripts

| Script          | Purpose                              |
|-----------------|--------------------------------------|
| `npm run dev`   | Start dev server with hot-reload     |
| `npm run build` | Compile TypeScript                   |
| `npm test`      | Run tests                            |
| `npm run lint`  | Lint all files                       |

## Docker

```bash
# Development
docker build -f docker/dev/Dockerfile -t catalog-service:dev .

# Production
docker build -f docker/prod/Dockerfile -t catalog-service:prod .
```

## Architecture Notes

- **Layered pattern**: Router → Controller → Service → Model per domain.
- **Multi-tenancy**: Products and Toppings are scoped by `tenantId`.
- **Event-driven**: Product/Topping changes emit Kafka events on topics `"product"` and `"topping"`.
- **Auth**: JWT tokens verified against an external JWKS endpoint; tokens accepted via `Authorization` header or `accessToken` cookie.
- **Image upload**: Images stored in AWS S3 with UUID filenames; max file size 500 KB.
