# Corvo Zap — Backend

API backend do **Corvo Zap**: mensagens entre usuários com entrega simulada por distância entre cidades. Construído com NestJS, TypeORM e SQLite, seguindo arquitetura modular em camadas.

## Stack

- **NestJS** — framework HTTP e injeção de dependências
- **TypeORM** — persistência (SQLite)
- **Vitest** — testes unitários e e2e
- **Swagger** — documentação da API em `/api/docs`
- **JWT** — autenticação via Bearer token

## Módulos

| Módulo | Responsabilidade |
|---|---|
| `auth` | Login e geração/validação de JWT |
| `users` | Cadastro e listagem de usuários |
| `profile` | Perfil do usuário autenticado |
| `cities` | CRUD de cidades (coordenadas no mapa) |
| `chat` | Conversas entre dois usuários |
| `messages` | Envio e leitura de mensagens com entrega simulada |
| `delivery` | Cálculo de tempo de viagem e status de entrega |
| `crypto` | Criptografia do conteúdo das mensagens |
| `password` | Hash e comparação de senhas (bcrypt) |

## Arquitetura

Cada módulo segue a mesma organização de pastas. O módulo `users` é o modelo de referência:

```
src/modules/users/
├── application/usecases/
│   ├── create-users/
│   └── get-all-users/
├── domain/
│   ├── entities/
│   └── repositories/
│       └── interface-users/
├── infra/
│   ├── database/
│   │   ├── mapper/
│   │   └── typeorm/
│   │       ├── models/
│   │       ├── repositories/
│   │       └── tokens/
│   └── gateway/
├── interfaces/http/
│   └── controllers/
│       └── dtos/
└── shared/infra/http/
```

### Camadas

- **`application/usecases`** — casos de uso (orquestração da regra de negócio)
- **`domain`** — entidades, contratos de repositório, gateways e tipos
- **`infra`** — implementações concretas (TypeORM, serviços externos)
- **`interfaces/http`** — controllers e DTOs da API REST
- **`shared/infra/http`** — recursos HTTP compartilhados do módulo (guards, decorators)

Módulos sem banco de dados adaptam a mesma ideia:

- **`auth`** — guards e decorators em `shared/infra/http/`; token JWT em `infra/gateway/`
- **`password`** — contrato em `domain/gateways/`; bcrypt em `infra/gateway/`
- **`delivery`** — serviços em `application/usecases/`
- **`crypto`** — serviço em `domain/service/`
- **`profile`** — use case + controller HTTP (consome `users` e `cities`)

## Estrutura do projeto

```
backend/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── main.ts
│   ├── docs/swagger/
│   ├── modules/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── cities/
│   │   ├── crypto/
│   │   ├── delivery/
│   │   ├── messages/
│   │   ├── password/
│   │   ├── profile/
│   │   └── users/
│   └── shared/
│       └── infra/
│           ├── database/typeorm/
│           │   ├── config/
│           │   └── entities/
│           └── http/
├── tests/
│   ├── entities/
│   └── e2e/
├── corvozap.sqlite
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── vitest.config.e2e.ts
```

## Como rodar

```bash
# Instalar dependências
npm install

# Variáveis de ambiente (.env)
JWT_SECRET=sua-chave-secreta
PORT=3000

# Desenvolvimento
npm run start:dev

# Build de produção
npm run build
npm run start:prod
```

A API sobe em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/api/docs`.

## Endpoints principais

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/auth/login` | — | Autenticar e obter JWT |
| `POST` | `/users` | — | Criar usuário |
| `GET` | `/users` | JWT | Listar usuários |
| `GET` | `/profile/me` | JWT | Perfil do usuário logado |
| `GET` | `/cities` | JWT | Listar cidades |
| `GET` | `/cities/:id` | JWT | Buscar cidade |
| `POST` | `/cities` | JWT + admin | Criar cidade |
| `PATCH` | `/cities/:id` | JWT + admin | Atualizar cidade |
| `POST` | `/chats` | JWT | Criar chat |
| `GET` | `/chats/me` | JWT | Listar chats do usuário |
| `POST` | `/messages` | JWT | Enviar mensagem |
| `GET` | `/messages/chat/:chatId` | JWT | Mensagens de um chat |
| `GET` | `/messages/:id` | JWT | Buscar mensagem |

Rotas protegidas exigem o header `Authorization: Bearer <token>`.

## Testes

```bash
# Unitários
npm test

# Com cobertura
npm run test:cov

# E2E
npm run test:e2e

# Watch mode
npm run test:watch
```

## Scripts úteis

| Script | Descrição |
|---|---|
| `npm run start:dev` | Servidor em modo watch |
| `npm run build` | Compilar para `dist/` |
| `npm run lint` | ESLint com auto-fix |
| `npm run format` | Prettier nos arquivos `.ts` |
| `npm run start:doc` | Compodoc (documentação de código) |

## Banco de dados

O projeto usa **SQLite** (`corvozap.sqlite`) com `synchronize: true` em desenvolvimento. As entidades TypeORM de cada módulo são registradas em `src/shared/infra/database/typeorm/entities/index.ts`.
