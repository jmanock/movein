import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** For future path-based extractors. Prefer in-memory input whenever possible. */
export async function withTemporaryReceipt<T>(bytes: Uint8Array, processFile: (path: string) => Promise<T>): Promise<T> {
  const directory = await mkdtemp(join(tmpdir(), 'movein-receipt-'));
  const path = join(directory, 'input');
  try {
    await writeFile(path, bytes, { mode: 0o600, flag: 'wx' });
    return await processFile(path);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
