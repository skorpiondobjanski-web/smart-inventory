# Лабораторна робота №9 — Рефакторинг та якість коду

## Тема
Аналіз Code Smells, рефакторинг Legacy Code та оформлення Bug Report для системи «SmartInventory».

## Файли
| Файл | Опис |
|------|------|
| `ОПІ_Добжанський_ЛР9_КН-24-1.docx` | Звіт лабораторної роботи |
| `src/legacy/DocumentService.js` | Код **ДО** рефакторингу — Long Method, Nested Conditionals, CC=14 |
| `src/refactored/DocumentService.js` | Код **ПІСЛЯ** рефакторингу — Extract Method, Guard Clauses, Strategy Pattern (SOLID) |
| `docs/BUG-1048.md` | Bug Report #BUG-1048: помилка розрахунку FIFO при нульовій собівартості |

## Завдання
- Проаналізувати метрики складності коду (Cyclomatic & Cognitive Complexity)
- Провести рефакторинг Legacy Code (патерни: Extract Method, Guard Clauses, Strategy)
- Оформити Bug Report за стандартом (Jira/GitLab формат)
