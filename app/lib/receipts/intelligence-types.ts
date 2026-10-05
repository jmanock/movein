export const ITEM_ROLES = ['durable_asset', 'consumable', 'maintenance_supply', 'replacement_part', 'service', 'food', 'apparel', 'other'] as const;
export type ItemRole = typeof ITEM_ROLES[number];
export const RECEIPT_TYPES = ['purchase', 'return', 'mixed', 'unknown'] as const;
export type ReceiptType = typeof RECEIPT_TYPES[number];
export const UNCERTAINTY_FLAGS = ['ambiguousName', 'inferredCategory', 'uncertainAssetClassification'] as const;
export type UncertaintyFlag = typeof UNCERTAINTY_FLAGS[number];
export const DATE_ORDERS = ['mdy', 'dmy', 'unknown'] as const;
export type DateOrder = typeof DATE_ORDERS[number];
