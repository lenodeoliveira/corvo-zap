# 🪶 Corvo-Zap

> Cansado de mensagens instantâneas? Escreva sua mensagem e mande seu corvo.

O **Corvo-Zap** é um aplicativo inspirado no envio de cartas por corvos. Diferente dos aplicativos tradicionais de mensagens, as mensagens **não são entregues instantaneamente**. O tempo de entrega depende da distância entre a cidade do remetente e a cidade do destinatário.

Este projeto está sendo desenvolvido com foco em estudo de arquitetura de software, Domain-Driven Design (DDD), NestJS e boas práticas de desenvolvimento backend.

---

# Objetivos

* Praticar arquitetura em camadas.
* Aplicar princípios de orientação a objetos.
* Trabalhar com casos de uso (Use Cases).
* Implementar autenticação com JWT.
* Criptografar mensagens.
* Simular um sistema de entrega de mensagens baseado em distância.
* Evoluir o projeto incrementalmente até uma aplicação completa.

---

# Tecnologias

* NestJS
* TypeScript
* TypeORM
* SQLite
* JWT
* bcrypt
* Crypto (Node.js)
* Swagger

---

# Conceito

Cada usuário pertence a uma cidade.

Quando uma mensagem é enviada:

1. O sistema identifica a cidade do remetente.
2. Identifica a cidade do destinatário.
3. Calcula a distância entre elas.
4. Calcula o tempo de viagem do corvo.
5. Agenda a entrega.
6. Criptografa o conteúdo.
7. Salva a mensagem.

Enquanto o corvo está viajando:

* o remetente pode visualizar a mensagem;
* o destinatário acompanha apenas o progresso da entrega.

Após a chegada:

* a mensagem é descriptografada e fica disponível ao destinatário.

---

# Arquitetura

```text
Users
│
├── Authentication
│
├── Chats
│
├── Messages
│
├── Cities
│
├── Distance
│
├── Delivery
│
├── Tracking
│
└── Crypto
```

Cada módulo possui uma responsabilidade bem definida.

---

# Funcionalidades implementadas

## Usuários

* Cadastro de usuários
* Senhas protegidas com bcrypt
* Associação do usuário a uma cidade

## Autenticação

* Login
* JWT
* Rotas protegidas

## Cidades

* Listagem de cidades
* Cadastro de cidades (somente administrador)

## Chats

* Criação de chats
* Listagem dos chats do usuário

## Mensagens

* Envio de mensagens
* Conteúdo criptografado
* Associação a um chat

## Distância

* Cálculo da distância entre cidades
* Cálculo do tempo de viagem

## Entrega

* Definição da data de partida
* Definição da data prevista de chegada

## Rastreamento

Cada mensagem possui informações de entrega:

* status
* progresso
* distância
* tempo restante
* previsão de chegada

---

# Fluxo de envio

```text
Usuário

↓

Seleciona um chat

↓

Escreve a mensagem

↓

DistanceService

↓

DeliveryService

↓

CryptoService

↓

MessageRepository

↓

SQLite
```

---

# Fluxo de leitura

```text
Usuário solicita a mensagem

↓

TrackingService

↓

É o remetente?

├── Sim → descriptografa
│
└── Não
     │
     ├── Entrega concluída?
     │      │
     │      ├── Sim → descriptografa
     │      │
     │      └── Não → retorna apenas o rastreamento
```

---

# Exemplo de resposta

```json
{
  "id": "31072f2c-3462-4e69-9192-c3ec370719cd",
  "chatId": "8da4d98c-3680-4f87-91b7-a0fa00e23a4c",
  "senderId": "26ae3a4c-5a1c-4977-8856-da4d003d7116",
  "departureAt": "2026-07-11T03:19:19.205Z",
  "originCityId": "2ee706a1-b467-469a-9042-6f9b26fe337a",
  "destinationCityId": "b47efff6-96ca-4faf-81e8-3d4de3be9e3d",
  "travelTimeMinutes": 1113,
  "tracking": {
    "status": "DELIVERED",
    "progress": 100,
    "distanceKm": 1484,
    "arrivalAt": "2026-07-11T21:52:19.205Z",
    "remainingMinutes": 0,
    "deliveredAt": "2026-07-11T21:52:19.205Z"
  },
  "content": "Tudo certo e com você?"
}
```

---

# Roadmap

## Backend

* [x] Cadastro de usuários
* [x] Login com JWT
* [x] Cadastro de cidades
* [x] Chats
* [x] Mensagens
* [x] Criptografia
* [x] Cálculo de distância
* [x] Agendamento de entrega
* [x] Rastreamento da mensagem
* [ ] Testes automatizados
* [ ] Notificações

## Mobile

* [ ] React Native
* [ ] Login
* [ ] Lista de chats
* [ ] Tela de conversa
* [ ] Rastreamento do corvo
* [ ] Mapa medieval
* [ ] Notificações Push

## Futuro

* [ ] Diferentes tipos de corvos
* [ ] Clima afetando a viagem
* [ ] Rotas entre cidades
* [ ] Sistema de amizades
* [ ] Grupos
* [ ] Skins para corvos
* [ ] Conquistas
* [ ] Histórico de viagens
* [ ] Deploy na AWS

---

# Objetivo do projeto

O Corvo-Zap não pretende ser apenas um aplicativo de mensagens, mas um projeto de estudo para explorar arquitetura de software, modelagem de domínio e boas práticas de desenvolvimento, utilizando um domínio diferente dos exemplos tradicionais de CRUD.
