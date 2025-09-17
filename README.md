# Mood Weather Insights

Projeto pessoal full-stack que gera **temas (insights)** combinando:

1. Tópico fornecido pelo usuário
2. Clima atual (via OpenWeather)
3. Enriquecimento textual com OpenAI

O backend monta um prompt contextual (tópico + condições meteorológicas) e salva o texto retornado.

## Visão Geral

| Camada  | Descrição                                                                     |
| ------- | ----------------------------------------------------------------------------- |
| Backend | API NestJS (Auth JWT, geração de temas, OpenAI, OpenWeather, Prisma/Postgres) |
| Mobile  | App Expo (autenticação, criação/listagem de temas, Gluestack UI + NativeWind) |

## Fluxo Alto Nível

1. Login/registro → tokens (access + refresh)
2. Mobile envia tópico + lat/lon
3. Backend consulta clima (OpenWeather)
4. Gera tema via OpenAI
5. Salva e retorna ao app
6. Refresh automático via `/auth/refresh`

## Principais Tecnologias

- Backend: NestJS 11, Prisma, PostgreSQL, JWT, OpenAI, OpenWeather
- Mobile: Expo, React Query, Zustand, Axios, NativeWind, Gluestack UI
- Infra: Docker (Postgres + imagem API)

## Estrutura de Pastas

```text
backend/  # API NestJS + Prisma
mobile/   # App Expo
```

## Variáveis de Ambiente (Backend)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase?schema=public
OPENWEATHER_KEY=...
OPENWEATHER_BASE_URL=https://api.openweathermap.org
OPENAI_API_KEY=...
JWT_SECRET=alterar-em-producao
PORT=3000
```

## Execução Rápida

Backend:

```bash
cd backend
cp .env.exemple .env
docker compose up -d postgres
npm install
npx prisma generate
npm run dev
```

Mobile:

```bash
cd mobile
npm install
npx expo start
```

## Docker (Produção Backend)

```bash
cd backend
docker build -t mood-backend .
docker run -p 3000:3000 --env-file .env mood-backend
```

## Roadmap Futuro

- Healthcheck `/health`
- Rate limiting
- Logs estruturados / observabilidade
- Rotação avançada de refresh tokens
- Testes E2E integrados

## Projeto Pessoal

Sem licença formal (uso próprio / estudo).  
Veja `backend/README.md` e `mobile/README.md` para detalhes.
