# CHECKOUT PROJECT

### 📂 Project structure

```
checkout-backend/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── main.ts
│   ├── docs/swagger/
│   └── modules/pricing/
│       ├── application/usecases/
│       │   ├── create-payment-methods/
│       │   ├── create-prices/
│       │   └── get-all-prices/
│       ├── domain/
│       │   ├── @shared/
│       │   │   ├── entity/
│       │   │   ├── errors/
│       │   │   └── service/
│       │   ├── @types/
│       │   ├── entities/
│       │   ├── gateways/
│       │   └── repositories/
│       │       ├── payment-method/
│       │       └── pricing/
│       ├── infra/
│       │   ├── database/
│       │   │   ├── mapper/
│       │   │   └── typeorm/
│       │   │       ├── config/
│       │   │       ├── models/
│       │   │       └── tokens/
│       │   └── gateway/
│       ├── interfaces/http/
│       │   └── controllers/
│       │       └── dtos/
│       └── shared/infra/http/
├── tests/
│   ├── application/usecases/
│   ├── domain/
│   │   ├── entity/
│   │   └── services/
│   ├── e2e/
│   ├── infra/
│   └── interfaces/http/controllers/
├── dist/
├── coverage/
├── README.md
├── package.json
├── package-lock.json
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── vitest.config.ts
├── vitest.config.e2e.ts
├── eslint.config.mjs
├── global.d.ts
└── database.sqlite

```