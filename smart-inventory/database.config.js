// database.config.js
// Конфігурація з'єднання з базою даних PostgreSQL для SmartInventory
// Результат вирішення merge-конфлікту між гілками develop та feature/performance (ЛР6)

const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  database: process.env.DATABASE_NAME || 'smart_inventory',
  user: process.env.DATABASE_USER || 'db_admin',
  password: process.env.DATABASE_PASSWORD || 'SecretSecurePassword2026',

  // Компромісний таймаут після вирішення merge-конфлікту:
  // develop: 5000 мс (стабільність), feature/performance: 2000 мс (швидкість)
  // Рішення: обрано 3000 мс як баланс між продуктивністю та стабільністю
  dbTimeout: 3000, // Компромісний таймаут після merge-конфлікту

  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
  },
};

module.exports = dbConfig;
