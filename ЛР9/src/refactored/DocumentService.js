// Clean Code — Лабораторна робота №9 (Рефакторинг)
// Приклад коду ПІСЛЯ рефакторингу
// Застосовані патерни: Extract Method, Guard Clauses, Strategy Pattern (SRP / SOLID)

class DocumentService {
  constructor(validators, processors, alertService) {
    this.validators = validators;
    this.processors = processors; // Мап'а, що містить стратегії INFLOW та OUTFLOW
    this.alertService = alertService;
  }

  processDocument(doc) {
    // 1. Guard clauses (ранній вихід)
    this.validateDocumentPresence(doc);

    // 2. Вибір стратегії обробки за типом документа (прихід/видаток)
    const processor = this.processors[doc.type];
    if (!processor) {
      throw new Error(`Невідомий тип документа: ${doc.type}`);
    }

    // 3. Виконання обробки
    processor.execute(doc);
    doc.status = 'PROCESSED';

    // 4. Перевірка залишків та сповіщення
    this.alertService.checkWarehouseAlerts(doc);
  }

  validateDocumentPresence(doc) {
    if (!doc) {
      throw new Error("Документ не знайдено!");
    }
    if (!doc.items || doc.items.length === 0) {
      throw new Error("Документ порожній!");
    }
  }
}

module.exports = DocumentService;
