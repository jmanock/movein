/** The two private entry points; never permit arbitrary redirects from browser input. */
export function signInDestination(value: unknown): '/my-home' | '/receipts' {
  return value === '/receipts' ? '/receipts' : '/my-home';
}
