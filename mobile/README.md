# Mobile – Mood Weather Insights

Aplicativo **Expo / React Native** que autentica o usuário e solicita ao backend a geração de **temas (insights)** baseados em:

1. Tópico digitado pelo usuário
2. Clima atual (latitude/longitude → OpenWeather)
3. Enriquecimento semântico via OpenAI

O retorno é um texto temático contextualizado ao estado do tempo.

## Stack

- Expo + React Native 0.81
- Expo Router (file-based navigation)
- Zustand (estado auth)
- Axios (HTTP + refresh token interceptor)
- React Query (cache e sincronização server state)
- NativeWind + Tailwind Variants + Gluestack UI (UI / design system)
- Toastify React Native (feedback)

## Estrutura Simplificada

```text
app/                # rotas (auth, tabs, insights)
components/         # componentes de UI e domínio
stores/             # zustand stores (auth)
lib/                # api-client, chamadas HTTP, validações
hooks/              # hooks custom (ex: localização)
constants/          # config (API base)
assets/             # imagens / estilos globais
```

## Pré-Requisitos

- Node 20+
- Expo CLI (opcional) `npm i -g expo`
- Backend rodando (ver README em `backend/`)

## Variáveis / Configuração

O endpoint base da API está em `constants/api.ts`. Ajuste se necessário:

```ts
export const API_BASE_URL = "http://localhost:3000";
```

Se usar em dispositivo físico, exponha o host da máquina (ex: IP local).

## Instalação

```bash
npm install
```

## Execução

```bash
npx expo start          # abre interface interativa
npx expo start --android
npx expo start --ios    # em macOS
npx expo start --web    # versão web (experimental)
```

Após iniciar, abra com:

- Android Emulator / iOS Simulator
- App Expo Go (escaneando QR)

## Autenticação & Refresh Token

- Armazena `accessToken` e `refreshToken` em store persistida (memória custom baseada em Map – pode trocar por SecureStore depois).
- Interceptor Axios renova token ao receber 401 via `/auth/refresh`.
- Falha no refresh => limpa store e redireciona para `(auth)/login`.

## Geração de Temas

Fluxo:

1. Usuário autentica
2. Informa um tópico
3. App obtém localização (se permitido) e envia tópico + lat/lon
4. Backend busca clima + usa OpenAI para gerar tema
5. Resposta exibida na lista/detalhe

## Scripts Úteis

```bash
npm run reset-project   # limpa exemplo boilerplate original
npm run lint            # lint (eslint config expo)
```

## Troubleshooting

| Problema                       | Causa Comum                   | Solução                              |
| ------------------------------ | ----------------------------- | ------------------------------------ |
| 401 constante                  | Refresh endpoint indisponível | Verifique `/auth/refresh` no backend |
| Sem localização                | Permissão negada              | Ajustar permissões no dispositivo    |
| Imagens/SVG não renderizam     | Metro sem transformer         | Conferir `metro.config.js`           |
| Dispositivo físico não conecta | IP incorreto                  | Trocar `localhost` por IP da máquina |

## Build (EAS opcional)

Configuração EAS não inclusa; adicionar `eas.json` se for publicar.

## Próximos Passos Sugeridos

- Armazenar tokens com SecureStore/Keychain
- Internacionalização
- Testes de componentes (React Testing Library)

---

Projeto pessoal (sem licença formal). Veja README raiz para visão geral.
