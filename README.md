# FIAP Tech Challenge 6SOAT

## Grupo 7

# FIAP FASE 5

### Stack Utilizada

**Back-end:**

- Node.js    20
- TypeScript 5.1.3
- Nest.js    10.0.0
- Prisma     6.2.1",
- Jest       29.5.0

**Banco de Dados:**

- PostgreSQL


## Iniciando o Projeto USUÁRIO

Siga os passos abaixo para iniciar o projeto em sua máquina local:

1. **Docker**: 
   - Certifique-se de que o Docker esteja instalado e em execução. Se você estiver usando o Docker Desktop, abra-o.

2. **Subir os Contêineres**:
   - Execute o seguinte comando para iniciar os contêineres em segundo plano:
 ```bash
    docker compose up -d
 ```
   - Para verificar o status dos contêineres, use:
```bash
    docker compose ps
```

3. **Instalação das Dependências**:
   - Instale as dependências do projeto com:
 ```bash
    npm install
```

4. **Geração do Prisma**:
   - Gere os clientes do Prisma para os ambientes de teste e desenvolvimento:
```bash
    npm run prisma:generate:test
    npm run prisma:generate:development
```

5. **Migrações do Prisma**:
   - Execute as migrações para os ambientes de teste e desenvolvimento:
```bash
    npm run prisma:migrate:test
    npm run prisma:migrate:development
```

6. **Iniciar o Servidor**:
   - Por fim, inicie o servidor em modo de desenvolvimento:
```bash
     npm run start:dev
```


## API

### Upload Video

```bash
POST http://localhost:3000/upload/video
Headers: Content-Type: multipart/form-data
Body: Video file
Authorization: Bearer <token>
``` 


## Rodando os testes do Projeto USUÁRIO

1. **Intalar as bibliotecas do projeto**: 
   - Instale as dependências do projeto com:
```bash
    npm install
```

2. **Rodar os testes unitários**:
   - Execute o seguinte comando para rodar os iniciar os contêineres em segundo plano:
```bash
    npm run test:unit
```
   
3. **Rodar os testes e2e**:
   - Execute o seguinte comando para rodar os iniciar os contêineres em segundo plano:
```bash
    npm run test:e2e
```

4. **Rodar os testes para verificar a cobertura dos testes**:
   - Execute o seguinte comando para rodar os iniciar os contêineres em segundo plano:
```bash
    npm run test:cov
```