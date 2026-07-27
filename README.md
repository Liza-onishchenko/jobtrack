# JobTrack

Fullstack застосунок для трекінгу відгуків на фріланс-вакансії.

## Стек

**Client** — React, TypeScript, Vite, React Router, Redux Toolkit, Axios, Recharts.

**Server** — Node.js, Express, TypeScript, MongoDB (Mongoose), JWT-автентифікація, Telegram Bot API (сповіщення), node-cron (нагадування).

## Структура проєкту

```
jobtrack/
├── client/          # React + TypeScript фронтенд (Vite)
└── server/          # Express + TypeScript бекенд
    └── src/
        ├── models/       # Mongoose-моделі
        ├── routes/       # Express-роути
        ├── controllers/  # Обробники запитів
        └── middleware/   # Express middleware (auth, error handling тощо)
```

## Запуск

### Сервер

```bash
cd server
npm install
cp .env.example .env   # заповніть значення (PORT, MONGO_URI, JWT_SECRET, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
npm run dev             # режим розробки (ts-node-dev)
npm run build && npm start   # production-збірка
```

### Клієнт

```bash
cd client
npm install
npm run dev
```

Клієнт за замовчуванням доступний на `http://localhost:5173`, сервер — на `http://localhost:5000`.

## Змінні середовища сервера

| Змінна                | Опис                                                      |
|-----------------------|-------------------------------------------------------------|
| `PORT`                | Порт, на якому запускається сервер                         |
| `MONGO_URI`           | Рядок підключення до MongoDB                               |
| `JWT_SECRET`          | Секрет для підпису JWT-токенів                             |
| `TELEGRAM_BOT_TOKEN`  | Токен Telegram-бота (від @BotFather) для сповіщень         |
| `TELEGRAM_CHAT_ID`    | ID чату/користувача, куди бот надсилає сповіщення           |
