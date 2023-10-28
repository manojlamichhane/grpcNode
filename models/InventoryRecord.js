function InventoryRecord(
  inventoryId,
  name,
  description,
  unitPrice,
  quantityInStock,
  inventoryValue,
  reorderLevel,
  reorderTime,
  quantityInReorder,
  discontinued
) {
  (this.inventoryId = inventoryId),
    (this.name = name),
    (this.description = description),
    (this.unitPrice = unitPrice),
    (this.quantityInStock = quantityInStock),
    (this.inventoryValue = inventoryValue),
    (this.reorderLevel = reorderLevel),
    (this.reorderTime = reorderTime),
    (this.quantityInReorder = quantityInReorder),
    (this.discontinued = discontinued);
}

module.exports = InventoryRecord;
