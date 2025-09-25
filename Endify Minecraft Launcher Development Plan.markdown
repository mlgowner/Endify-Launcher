# Досканальный план создания Minecraft-лаунчера "endify"

Цель: Создать кроссплатформенный лаунчер с визуальным стилем VimeWorld (минималистичный, тёмный, сервер-ориентированный UI) и функционалом TLauncher (поддержка всех версий Minecraft, модов, скинов, оффлайн-режима, кастомизации). План минимизирует недочёты через модульность, тестирование и документирование.

## 1. Определение целей и требований (1–2 дня)
### Цели
- **Визуал (VimeWorld)**: Чистый, тёмный UI с полупрозрачными панелями, анимациями (CSS), боковым фидом новостей, карточками серверов. Шрифты: Roboto/Noto Sans. Темы: тёмная/светлая.
- **Функционал (TLauncher)**:
  - **Авторизация**: Microsoft OAuth, оффлайн-режим (ввод ника), быстрая смена аккаунта, регистрация через сайт.
  - **Версии**: Все Minecraft-версии (1.0–1.21.3), включая Forge, Fabric, OptiFine, LiteLoader.
  - **Моды/ресурспаки**: Загрузка через CurseForge/Modrinth API, установка одним кликом, открытие папки `.minecraft`.
  - **Скины/плащи**: Загрузка .png с превью, интеграция с ely.by или своим API.
  - **Серверы**: Список серверов (свой/публичный) с пингом, онлайном, авто-подключением.
  - **Настройки**: RAM (256MB–16GB), JVM-аргументы, разрешение окна, FPS-буст, полноэкранный режим, авто-заход.
  - **Новости**: Фид из VK/Telegram/RSS, отображаемый в боковой панели.
  - **Оффлайн-режим**: Запуск без интернета, кэш версий/профилей.
  - **Дополнительно**: Мультиязычность (RU/EN), профиль (статистика), автообновления, косметика (шляпы/плащи).
- **Технические требования**:
  - Кроссплатформенность: Windows (7/10/11), Linux (Ubuntu/Debian), macOS (опционально).
  - Минимальная нагрузка: <100MB RAM для лаунчера.
  - Лицензия: Apache 2.0, с указанием "Неофициальный лаунчер".
  - Безопасность: HTTPS для API, шифрование токенов (AES).

### Риски и их минимизация
- **Mojang/Microsoft**: Используй только официальные API (https://wiki.vg). Не храни пароли.
- **Копирайт**: Не копируй UI/код VimeWorld/TLauncher 1:1. Используй Tailwind CSS для стиля.
- **Ошибки**: Логирование (Winston), автоматическая отправка баг-репортов.
- **Лимиты API**: Кэшируй данные (SQLite), используй прокси для CurseForge.

## 2. Изучение технологий и анализ (2–3 дня)
### Анализ VimeWorld
- **UI**: HTML/LESS/JS, npm для сборки, Python для build (GitHub: VimeWorld/LauncherUI). Полупрозрачные панели, анимации (CSS keyframes), боковой фид новостей.
- **API**: https://api.vimeworld.com (auth, сервера, профиль).
- **Особенности**: Быстрый запуск, авто-заход, интеграция с cp.vimeworld.com.

### Анализ TLauncher
- **Функционал**: Все версии MC, оффлайн-режим, моды (CurseForge), скины (ely.by), настройки JVM.
- **API**: Mojang для версий, ely.by для скинов, свой backend для профилей.
- **Особенности**: Лёгкая установка модов, поддержка старых версий (1.0).

### Технологии
- **Frontend**: Electron (v22+), Tailwind CSS (v3), Vite для сборки UI.
- **Backend**: Node.js (Express для API), SQLite (профили/кэш), Axios (HTTP-запросы).
- **Запуск**: Child_process для Java-команд.
- **Дополнительно**: Python (build-скрипты), Winston (логи), electron-updater (обновления).
- **API**:
  - Mojang: `https://launchermeta.mojang.com/mc/game/version_manifest.json`.
  - Microsoft OAuth: `minecraft-auth` (npm).
  - CurseForge/Modrinth: Моды/ресурспаки.
  - Ely.by: Скины/плащи.

### Ресурсы
- GitHub: VimeWorld/LauncherUI (UI), TLauncher Wiki (функционал).
- Доки: Electron, Tailwind CSS, Mojang API (https://wiki.vg).
- Туториалы: "Electron Minecraft Launcher" (YouTube), CurseForge API docs.

## 3. Проектирование архитектуры (2 дня)
### Структура проекта
```
endify-launcher/
├── src/
│   ├── auth/            # login.js, offline.js, oauth.js
│   ├── versions/        # fetch.js, install.js
│   ├── mods/            # curseforge.js, modrinth.js
│   ├── skins/           # upload.js, preview.js
│   ├── servers/         # list.js, ping.js
│   ├── news/            # vk.js, rss.js
│   ├── settings/        # ram.js, jvm.js, themes.js
│   ├── downloader/      # assets.js, libraries.js
│   ├── launcher/        # java-cmd.js
│   └── utils/           # logger.js, cache.js
├── public/              # index.html, output.css, assets/
├── build/               # build.py
├── config.json          # Default RAM, servers, language
├── package.json         # Dependencies
└── logs/                # Error logs
```

### Модули
- **Frontend**: Electron window (800x600, resizable, безрамочный), Tailwind CSS (VimeWorld-стиль: тёмный фон, полупрозрачные панели).
- **Backend**: Express API (`/auth`, `/skins`, `/profile`), SQLite (профили, кэш версий).
- **Кэширование**: `.minecraft/endify/cache` для версий/ассетов.
- **Логи**: Winston в `logs/error.log`.

## 4. Разработка (14–22 дня)
Установи: Node.js (v18+), Python 3.10, VS Code. Инициализируй: `npm init`, `npm install electron axios sqlite3 tailwindcss vite child_process winston electron-updater minecraft-auth`.

### Шаг 1: Настройка Electron и UI (2–3 дня)
- **Main Process** (`main.js`): Безрамочное окно, IPC для общения.
  ```javascript
  const { app, BrowserWindow, ipcMain } = require('electron');
  let win;
  app.whenReady().then(() => {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      webPreferences: { preload: './src/preload.js' }
    });
    win.loadFile('public/index.html');
  });
  ```
- **Preload** (`src/preload.js`): Безопасный доступ к IPC.
  ```javascript
  const { contextBridge, ipcRenderer } = require('electron');
  contextBridge.exposeInMainWorld('api', {
    login: (data) => ipcRenderer.invoke('login', data),
    launch: (args) => ipcRenderer.invoke('launch', args)
  });
  ```
- **UI** (`public/index.html`): VimeWorld-стиль (тёмный, минималистичный).
  ```html
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>endify</title>
    <link href="output.css" rel="stylesheet">
  </head>
  <body class="bg-gray-900 text-white font-roboto">
    <div class="flex h-screen">
      <aside class="w-1/4 bg-gray-800/50 p-4 overflow-y-auto">Новости</aside>
      <main class="w-3/4 p-6">
        <div class="bg-gray-800/70 p-4 rounded-lg">Логин | Серверы | Настройки</div>
      </main>
    </div>
    <script src="renderer.js"></script>
  </body>
  </html>
  ```
- **CSS** (`public/tailwind.css` → `output.css` via Vite):
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  .btn { @apply bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition; }
  ```
- **Vite Config** (`vite.config.js`): Быстрая сборка UI.
  ```javascript
  import { defineConfig } from 'vite';
  export default defineConfig({
    build: { outDir: 'public', assetsDir: 'assets' }
  });
  ```
- **Тестирование**: `npm run dev` (Vite), `electron .`.

### Шаг 2: Авторизация (2–3 дня)
- **Логин** (`src/auth/login.js`): Форма (ник/пароль), Microsoft OAuth, оффлайн-режим.
  ```javascript
  const { ipcRenderer } = require('electron');
  document.getElementById('login-btn').addEventListener('click', async () => {
    const user = await ipcRenderer.invoke('login', {
      username: document.getElementById('username').value,
      offline: document.getElementById('offline').checked
    });
    localStorage.setItem('user', JSON.stringify(user));
  });
  ```
- **Backend** (`src/auth/oauth.js`): Microsoft OAuth via `minecraft-auth`.
  ```javascript
  const { Auth } = require('minecraft-auth');
  ipcMain.handle('login', async (event, { username, offline }) => {
    if (offline) return { username, uuid: 'offline-' + username };
    const auth = await Auth.loginMicrosoft(username, password);
    return { username, accessToken: auth.accessToken, uuid: auth.uuid };
  });
  ```
- **SQLite** (`src/auth/db.js`): Хранение профилей.
  ```javascript
  const sqlite3 = require('sqlite3');
  const db = new sqlite3.Database('endify.db');
  db.run('CREATE TABLE IF NOT EXISTS profiles (username TEXT, token TEXT, uuid TEXT)');
  ```
- **Регистрация**: Кнопка → `shell.openExternal('https://cp.endify.com/register')`.
- **Проверка**: Тестируй оффлайн-режим, OAuth, смену аккаунта.

### Шаг 3: Версии и запуск (3–4 дня)
- **Fetch версий** (`src/versions/fetch.js`): Mojang API.
  ```javascript
  const axios = require('axios');
  async function fetchVersions() {
    const { data } = await axios.get('https://launchermeta.mojang.com/mc/game/version_manifest.json');
    return data.versions;
  }
  ```
- **UI** (`src/versions/renderer.js`): Dropdown с версиями.
  ```javascript
  const versions = await api.fetchVersions();
  const select = document.getElementById('version-select');
  versions.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id; opt.text = v.id;
    select.appendChild(opt);
  });
  ```
- **Запуск** (`src/launcher/java-cmd.js`):
  ```javascript
  const { spawn } = require('child_process');
  ipcMain.handle('launch', async (event, { version, ram, server }) => {
    const args = [
      `-Xmx${ram}G`, '-XX:+UseG1GC', '-jar', `versions/${version}/${version}.jar`,
      '--username', user.username, '--uuid', user.uuid, server ? `--server ${server}` : ''
    ];
    const proc = spawn('java', args, { cwd: '.minecraft' });
    proc.stderr.on('data', (data) => require('winston').error(data.toString()));
    return proc.pid;
  });
  ```
- **Кэш**: Сохраняй версии в `.minecraft/endify/cache`.

### Шаг 4: Моды и ресурспаки (3 дня)
- **API** (`src/mods/curseforge.js`): Загрузка модов.
  ```javascript
  const axios = require('axios');
  async function installMod(modId) {
    const { data } = await axios.get(`https://api.curseforge.com/v1/mods/${modId}`);
    // Download to .minecraft/mods
  }
  ```
- **UI** (`src/mods/renderer.js`): Список модов, кнопка "Установить".
- **Ресурспаки**: Копируй в `.minecraft/resourcepacks`.

### Шаг 5: Скины и плащи (2 дня)
- **Upload** (`src/skins/upload.js`): .png (64x32/64x64).
  ```javascript
  const fs = require('fs');
  ipcMain.handle('upload-skin', async (event, filePath) => {
    const skin = fs.readFileSync(filePath);
    await axios.post('https://api.ely.by/skins', { skin });
  });
  ```
- **UI**: Превью (canvas), кнопка "Загрузить".

### Шаг 6: Серверы (2 дня)
- **List** (`src/servers/list.js`): JSON с серверами.
  ```javascript
  const servers = [
    { name: 'BedWars', ip: 'play.endify.com', desc: 'MiniGames' }
  ];
  ```
- **Ping** (`src/servers/ping.js`): Проверка онлайна.
- **UI**: Карточки (Tailwind: `flex`, `hover:bg-gray-700`).

### Шаг 7: Новости и профиль (1–2 дня)
- **Новости** (`src/news/vk.js`): VK API.
  ```javascript
  const axios = require('axios');
  async function fetchNews() {
    const { data } = await axios.get('https://api.vk.com/method/wall.get?owner_id=-GROUP_ID');
    return data.response.items;
  }
  ```
- **Профиль**: Ссылка на `cp.endify.com/{username}`.

### Шаг 8: Настройки (1–2 дня)
- **UI** (`src/settings/renderer.js`): Слайдер RAM, чекбоксы.
  ```javascript
  document.getElementById('ram-slider').addEventListener('input', (e) => {
    localStorage.setItem('ram', e.target.value);
  });
  ```
- **FPS-буст**: `-XX:+UseG1GC -XX:+UnlockExperimentalVMOptions`.

### Шаг 9: Автообновления и оффлайн (1–2 дня)
- **Updater** (`src/utils/updater.js`):
  ```javascript
  const { autoUpdater } = require('electron-updater');
  autoUpdater.checkForUpdatesAndNotify();
  ```
- **Оффлайн**: Кэш в SQLite, запуск без проверки токена.

## 5. Тестирование (5–7 дней)
- **Unit-тесты** (`tests/`): Jest для JS-модулей.
  ```javascript
  const { login } = require('../src/auth/oauth');
  test('offline login', async () => {
    const user = await login({ username: 'test', offline: true });
    expect(user.uuid).toBe('offline-test');
  });
  ```
- **Интеграционное**:
  - Логин: Microsoft, оффлайн, смена аккаунта.
  - Версии: 1.8.8, 1.12.2, 1.21.3.
  - Моды: OptiFine, JEI.
  - Серверы: Пинг, авто-заход.
  - Оффлайн: Запуск без интернета.
- **Кроссплатформа**: VM (Windows 10, Ubuntu 20.04).
- **Бета**: Discord-группа, баг-трекер.

## 6. Дополнительно (опционально, 5–7 дней)
- Косметика: API для плащей/шляп.
- Мультиязычность: JSON (`lang/en.json`, `lang/ru.json`).
- Анти-чит: BungeeCord плагин.

## 7. Публикация и поддержка (2–3 дня)
- **Сборка**: `electron-builder` → .exe/.deb.
  ```yaml
  # electron-builder.yml
  appId: com.endify.launcher
  win: { target: nsis }
  linux: { target: deb }
  ```
- **Хостинг**: GitHub Releases, endify.com.
- **Сообщество**: VK, Discord, форум.
- **Поддержка**: Логи в `logs/error.log`, баг-репорты на GitHub.

## 8. Долгосрочная поддержка
- **Обновления**: Мониторь Mojang API, CurseForge API.
- **Бэкапы**: Храни `.minecraft/endify` на сервере.
- **Документация**: README.md, API docs на endify.com.

| Этап | Время | Инструменты | Проблемы и решения |
|------|-------|-------------|--------------------|
| 1. Цели | 1–2 дн | Docs | Сложность фич — начни с login/launch |
| 2. Изучение | 2–3 дн | GitHub/Wiki | API-лимиты — кэш в SQLite |
| 3. Архитектура | 2 дн | Draw.io | Сложный UI — модулируй |
| 4. Dev | 14–22 дн | VS Code, npm | Java-ошибки — логируй stderr |
| 5. Тесты | 5–7 дн | Jest, VM | Linux-баги — проверь GTK/Qt |
| 6. Extra | 5–7 дн | Mods API | Зависимости — минимизируй |
| 7. Публикация | 2–3 дн | GitHub | Копирайт — уникальный UI |