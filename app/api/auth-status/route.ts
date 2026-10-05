import { getCurrentHousehold } from '../../lib/households/current';
import { json } from '../../lib/receipts/http';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const context = await getCurrentHousehold(request);
  return json({ authenticated: context?.access === 'authenticated' });
}
