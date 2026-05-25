// Legacy Code — Лабораторна робота №9 (Рефакторинг)
// Приклад коду ДО рефакторингу
// Проблеми: Long Method, Nested Conditionals, висока цикломатична складність (CC = 14)

class DocumentService {
  processDocument(doc) {
    if (doc !== null && doc !== undefined) {
      if (doc.items.length > 0) {
        if (doc.type === 'INFLOW') {
          for (let i = 0; i < doc.items.length; i++) {
            let item = doc.items[i];
            if (item.quantity > 0 && item.price >= 0) {
              // Оприбуткування товару
              console.log("Оприбуткування: " + item.productId);
              db.saveStock(doc.warehouseId, item.productId, item.quantity);
            } else {
              throw new Error("Невалідні дані позиції!");
            }
          }
          doc.status = 'PROCESSED';
        } else if (doc.type === 'OUTFLOW') {
          for (let i = 0; i < doc.items.length; i++) {
            let item = doc.items[i];
            let currentStock = db.getStock(doc.warehouseId, item.productId);
            if (currentStock >= item.quantity) {
              // Списання за FIFO логікою...
              db.decreaseStock(doc.warehouseId, item.productId, item.quantity);
              // Перевірка safety stock
              let safety = db.getSafetyStock(item.productId);
              if (currentStock - item.quantity < safety) {
                console.log("УВАГА: Низький запас!");
                notifier.sendAlert(item.productId);
              }
            } else {
              throw new Error("Недостатньо запасу!");
            }
          }
          doc.status = 'PROCESSED';
        }
      } else {
        throw new Error("Документ порожній!");
      }
    } else {
      throw new Error("Документ не знайдено!");
    }
  }
}

module.exports = DocumentService;
