## Attention

First of all download and run NATS Server https://nats.io/download/nats-io/nats-server/ with default parameters.

### Start Nest

```bash
npm install
npm run start:dev
```

### Send data via NATS

```bash
node hemera.js
```

## Tests

### Nest 6.8.3+

```bash
% node hemera.js
Error!

# Nest log:
INCOMING DATA: undefined
INCOMING DATA: { name: "World" }
```

### Nest 6.7.2

```bash
% node hemera.js
Hello World!

# Nest log:
INCOMING DATA: { name: 'World' }
```

For install Nest 6.7.2 run:

```bash
npm i @nestjs/common@6.7.2 @nestjs/core@6.7.2 @nestjs/microservices@6.7.2 @nestjs/platform-express@6.7.2 @nestjs/testing@6.7.2
```
