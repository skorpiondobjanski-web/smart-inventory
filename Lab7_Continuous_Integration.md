# Міністерство освіти і науки України
# Звіт з лабораторної роботи №7
**З дисципліни:** «Основи програмної інженерії» (ОПІ)  
**Тема:** Неперервна інтеграція та доставка ПЗ (Continuous Integration & Continuous Delivery - CI/CD)  
**Варіант №11:** Система управління запасами (Inventory Management System)  

---

## МЕТА
Ознайомлення з концепцією неперервної інтеграції (CI) та неперервної доставки (CD), практичне налаштування автоматизованих процесів перевірки якості коду (Linting), автоматичного запуску тестів та збірки проєкту «SmartInventory» за допомогою інструменту **GitHub Actions**.

---

## ПОРЯДОК І ЗМІСТ ВИКОНАННЯ ЗАВДАНЬ

### ЗАВДАННЯ 1. АНАЛІЗ КОНЦЕПЦІЇ CI/CD ДЛЯ СИСТЕМИ «SMARTINVENTORY»

Впровадження практик CI/CD є обов'язковою умовою сучасної інженерії ПЗ для забезпечення стабільності та швидкого виходу оновлень системи на ринок.

**Процес CI/CD для нашої системи розділений на три фази:**
1. **Continuous Integration (Неперервна інтеграція):** При кожній спробі злити робочу гілку `feature/*` в інтеграційну гілку `develop` автоматично запускається хмарний сервер-збирач (Runner). Він встановлює залежності, перевіряє код на наявність помилок форматування (Linter) та запускає всі автоматизовані тести (включаючи математичний тест собівартості FIFO, розроблений в ЛР4). Якщо хоча б один тест падає, злиття гілок блокується.
2. **Continuous Delivery (Неперервна доставка):** Після злиття коду в `develop`, система автоматично збирає оновлені Docker-образи та завантажує їх у хмарне сховище Docker Registry (Docker Hub) у статусі готовності до деплою.
3. **Continuous Deployment (Неперервне розгортання):** Автоматичний деплой оновлених контейнерів на тестовий сервер (Staging) та, після фінального затвердження менеджером, на робочий сервер (Production).

---

### ЗАВДАННЯ 2. КОНФІГУРАЦІЯ АВТОМАТИЧНОЇ ПЕРЕВІРКИ ЯКОСТІ КОДУ (LINTING)

Для підтримки єдиного стилю написання коду в команді та автоматичного виявлення потенційних багів (наприклад, неоголошених змінних) налаштовано інструменти **ESLint** та **Prettier**.

У корінь проєкту додано файл конфігурації `.eslintrc.json`:
```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint/eslint-plugin"],
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "root": true,
  "env": {
    "node": true,
    "jest": true
  },
  "ignorePatterns": [".eslintrc.js", "dist", "node_modules"],
  "rules": {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": "warn",
    "curly": "error"
  }
}
```

Також додано файл правил форматування коду `.prettierrc`:
```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true
}
```

---

### ЗАВДАННЯ 3. СТВОРЕННЯ РОБОЧОГО ПРОЦЕСУ GITHUB ACTIONS (`ci.yml`)

Для автоматизації збірки та тестування системи «SmartInventory» створено конфігураційний файл робочого процесу GitHub Actions. Файл розміщено в репозиторії за шляхом `.github/workflows/ci.yml`.

```yaml
name: SmartInventory Continuous Integration (CI)

# 1. Події, що запускають процес: коміти та Pull Requests у гілки develop та main
on:
  push:
    branches: [ develop, main ]
  pull_request:
    branches: [ develop, main ]

jobs:
  # Робота 1: Перевірка якості та автоматизоване тестування
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    # Крок 1: Завантаження коду з репозиторію
    - name: Checkout repository code
      uses: actions/checkout@v3

    # Крок 2: Встановлення середовища Node.js
    - name: Set up Node.js environment
      uses: actions/setup-node@v3
      with:
        node-node: '18.x'
        cache: 'npm'

    # Крок 3: Кешування та встановлення npm-залежностей
    - name: Install dependencies
      run: npm ci

    # Крок 4: Запуск лінтера (перевірка якості коду)
    - name: Run code linting check
      run: npm run lint

    # Крок 5: Запуск автоматизованих юніт-тестів
    - name: Run Jest Unit Tests
      run: npm run test

    # Крок 6: Перевірка збірки проєкту (Compilation check)
    - name: Compile backend application
      run: npm run build
```

---

### ЗАВДАННЯ 4. АВТОМАТИЧНА ЗБІРКА DOCKER-ОБРАЗІВ ТА ПУБЛІКАЦІЯ У REGISTRY

Для реалізації фази неперервної доставки (CD) у файл автоматизації додано додаткову роботу (`job`), яка запускається виключно у разі успішного проходження першого етапу (тестування) та лише при злитті коду в гілку `main`.

```yaml
  # Робота 2: Збірка Docker-образу та публікація у Docker Registry
  build-and-publish-docker:
    needs: build-and-test # Запускається лише після успішних тестів
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
    # Крок 1: Завантаження коду
    - name: Checkout code
      uses: actions/checkout@v3

    # Крок 2: Автентифікація в Docker Hub з використанням секретів репозиторію
    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}

    # Крок 3: Збірка та публікація Docker-образу Backend API
    - name: Build and Push Backend Docker Image
      uses: docker/build-push-action@v4
      with:
        context: .
        file: ./Dockerfile
        push: true
        tags: |
          smartinventory/backend:latest
          smartinventory/backend:${{ github.sha }}
```

Цей крок забезпечує повну автоматизацію підготовки дистрибутива системи до встановлення на сервер. Розробнику більше не потрібно вручну збирати та завантажувати образи додатків, що повністю виключає людський фактор при випуску релізів.

---

## ВИСНОВОК
Під час виконання лабораторної роботи №7 було вивчено принципи неперервної інтеграції та доставки ПЗ. Налаштовано файли конфігурації ESLint та Prettier для контролю стилістичної чистоти вихідного коду системи «SmartInventory». Створено повноцінний робочий процес GitHub Actions (`ci.yml`), який при кожному оновленні репозиторію автоматично перевіряє код лінтером, запускає юніт-тести та збирає проєкт. Також реалізовано автоматичну збірку та публікацію Docker-образів у хмарний реєстр Docker Hub, що є вершиною автоматизації процесів релізингу ПЗ.

---
**Звіт підготував:**  
Студент курсу «Основи програмної інженерії»  
*(Підпис, Дата)*
