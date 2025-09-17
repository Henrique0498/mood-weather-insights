# Backend – Mood Weather Insights

API pessoal em **NestJS** responsável por autenticar usuários e gerar **temas (insights)** combinando:

1. **Tópico enviado pelo usuário**
2. **Dados de clima atual** (OpenWeather)
3. **Enriquecimento temático** via OpenAI (gera texto contextualizado ao tópico dentro do contexto meteorológico)

O resultado é armazenado como Insight no Postgres via **Prisma**. Autenticação com **JWT** (access + refresh tokens).

## Stack

- NestJS 11
- Prisma + PostgreSQL
- JWT (access / refresh)
- OpenAI (geração de tema)
- OpenWeather (dados meteorológicos)
- Cache (planejado)

## Estrutura (principais diretórios)

```text
src/
  auth/
  user/
  insights/
  common/
    open-ai/
    open-weather/
    auth/
prisma/
  schema.prisma
```

## Docker

Multi-stage Dockerfile incluso.

### Script rápido

Após configurar `.env` (incluindo `DATABASE_URL` apontando para um Postgres acessível):

```bash
npm run deploy:docker
```

O script faz:

1. `docker build -t mood-backend .`
2. Remove container anterior se existir (`docker rm -f mood-backend`)
3. `docker run --name mood-backend --env-file .env -p 3000:3000 mood-backend`

### Build manual

```bash
docker build -t mood-backend .
```

### Executar manualmente

```bash
docker run --name mood-backend \
  --env-file .env \
  -p 3000:3000 \
  mood-backend
```

Sem `--env-file`, pode-se passar variáveis isoladamente (exemplo):

```bash
docker run --name mood-backend \
  -e DATABASE_URL="postgresql://user:password@host:5432/mydatabase?schema=public" \
  -e OPENWEATHER_KEY=xxx \
  -e OPENWEATHER_BASE_URL=https://api.openweathermap.org \
  -e OPENAI_API_KEY=xxx \
  -e JWT_SECRET=super-secret \
  -e PORT=3000 \
  -p 3000:3000 \
  mood-backend
```

### Migrações (Produção / Deploy real)

Se você estiver usando migrations aplicadas, antes de iniciar a aplicação em produção rode:

```bash
docker exec -it mood-backend npx prisma migrate deploy
```

Ou adapte a imagem para executar `prisma migrate deploy` como entrypoint em ambiente controlado (CI/CD).

### Compose (exemplo básico)

```yaml
services:
  db:
    image: postgres:15
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
      POSTGRES_DB: mood
    ports:
      - "5432:5432"
  api:
    build: .
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/mood?schema=public
      OPENWEATHER_KEY: your-key
      OPENWEATHER_BASE_URL: https://api.openweathermap.org
      OPENAI_API_KEY: your-key
      JWT_SECRET: change-me
      PORT: 3000
    ports:
      - "3000:3000"
```

## Scripts (npm)

| Script                   | Descrição                                                        |
| ------------------------ | ---------------------------------------------------------------- |
| `npm run start`          | Inicia a aplicação em modo padrão (sem watch).                   |
| `npm run dev`            | Desenvolvimento com reload automático (watch).                   |
| `npm run start:debug`    | Desenvolvimento com Node Inspector habilitado para depuração.    |
| `npm run build`          | Transpila TypeScript para JavaScript em `dist/`.                 |
| `npm run start:prod`     | Executa a aplicação compilada (`node dist/main`).                |
| `npm run lint`           | Verifica problemas de lint usando Biome (somente leitura).       |
| `npm run lint:fix`       | Tenta corrigir automaticamente problemas de lint.                |
| `npm run format`         | Formata o código (Biome format).                                 |
| `npm run test`           | Executa testes unitários (Jest).                                 |
| `npm run test:watch`     | Executa testes unitários em modo watch.                          |
| `npm run test:cov`       | Executa testes e gera relatório de cobertura.                    |
| `npm run test:debug`     | Roda Jest com debugger (`--inspect-brk`, execução serial).       |
| `npm run test:e2e`       | Executa testes end-to-end com config dedicada.                   |
| `npm run deploy:docker`  | Atalho para `docker:rebuild` (reconstrói e sobe container).      |
| `npm run docker:build`   | Build da imagem Docker `mood-backend`.                           |
| `npm run docker:run`     | Sobe container usando `.env` e expõe porta 3000.                 |
| `npm run docker:rebuild` | Build + remove container anterior (se existir) + run novo.       |
| `npm run docker:stop`    | Para e remove o container `mood-backend`.                        |
| `npm run docker:logs`    | Segue (follow) os logs do container.                             |
| `npm run docker:exec:sh` | Abre um shell dentro do container para inspeção.                 |
| `npm run docker:migrate` | Executa `prisma migrate deploy` dentro do container em execução. |

Observações:

- Use `docker:migrate` somente após container iniciado e banco acessível.
- Em Windows PowerShell os redirecionamentos já foram tratados nos scripts (`2>NUL || true`).
- Para rebuild rápido durante ajustes de código: `npm run docker:rebuild`.

## Banco de Dados (Postgres via Docker Compose)

Subir Postgres local:

```bash
docker compose up -d postgres
```

Gerar client Prisma (necessário após alterar schema):

```bash
npx prisma generate
```

## Execução Local

```bash
cp .env.exemple .env   # preencha valores
npm install
npx prisma generate
npm run dev
```

API: `http://localhost:${PORT|3000}`

## Build de Produção (sem Docker)

```bash
<!-- seção Docker antiga removida (substituída pela nova acima) -->
  -e PORT=3000 \
  -p 3000:3000 \
  mood-backend
```

Para compose: adicionar serviço da API referenciando a mesma network do Postgres.

## Refresh Token

Endpoint `/auth/refresh` deve retornar `{ accessToken, refreshToken? }` para o app mobile continuar sessão sem pedir novo login.

## Testes

```bash
npm run test       # unit
npm run test:e2e   # e2e
npm run test:cov   # cobertura
```

## Segurança / Boas Práticas

- Alterar `JWT_SECRET` em qualquer ambiente exposto
- Não versionar `.env`
- Rate limiting (futuro)
- Restringir CORS conforme domínios reais

## Próximos Melhoramentos Possíveis

- Endpoint `/health`
- `prisma migrate deploy` em pipeline
- Logs estruturados / observabilidade
- Rotation de refresh token

---

Projeto pessoal – sem licença formal. Veja README raiz para panorama.
