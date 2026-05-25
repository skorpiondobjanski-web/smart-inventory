# Лабораторна робота №7 — Безперервна інтеграція та доставка (CI/CD)

## Тема
Налаштування CI/CD pipeline за допомогою GitHub Actions: лінтинг, тестування, збірка та публікація Docker-образу.

## Файли
| Файл | Опис |
|------|------|
| `ОПІ_Добжанський_ЛР7_КН-24-1.docx` | Звіт лабораторної роботи |
| `.eslintrc.json` | Конфігурація ESLint (TypeScript-парсер, правила якості коду) |
| `.prettierrc` | Конфігурація Prettier (форматування: single quotes, trailing commas) |
| `.github/workflows/ci.yml` | GitHub Actions workflow: build → lint → test → Docker publish |
| `Dockerfile` | Багатоетапна збірка Docker-образу Backend API (node:18-alpine) |

## Завдання
- Налаштувати статичний аналіз коду (ESLint + Prettier)
- Створити CI pipeline в GitHub Actions (ci.yml)
- Налаштувати CD: збірка та публікація Docker-образу до Docker Hub
