import { getCurrentHousehold } from '../../lib/households/current.ts';
import { getDatabase } from '../../../db/index.ts';
import { createReceiptRepository } from '../../lib/receipts/persistence.ts';
import { json, unauthorized } from '../../lib/receipts/http.ts';

export const runtime = 'nodejs';
export async function GET(request: Request) {
  const household = await getCurrentHousehold(request);
  if (!household) return unauthorized();
  try { const repository = createReceiptRepository(getDatabase(), household.householdId); return json({ items: repository.listInventory(), receipts: repository.listHistory() }); }
  catch { return json({ error: 'My Home could not be loaded. Please try again.' }, 503); }
}
