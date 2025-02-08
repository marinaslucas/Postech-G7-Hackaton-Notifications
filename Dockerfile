# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas arquivos essenciais antes da instalação (otimiza o cache do Docker)
COPY package.json package-lock.json ./

# Instala as dependências de produção
RUN npm ci --omit=dev

# Copia todo o código para dentro do container
COPY . .

# Garante que o `dist/` seja criado corretamente antes de executar a aplicação
RUN npm run build && ls -la /app/dist/

# Gera os binários corretos do Prisma para Linux
RUN npm run prisma:generate

# Define variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=8080

# Expõe a porta da aplicação
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
