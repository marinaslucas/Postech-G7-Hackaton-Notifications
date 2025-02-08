# FIAP FASE 5

## Iniciando o Projeto Localmente

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