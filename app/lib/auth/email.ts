import nodemailer from 'nodemailer';
import type { AuthConfig } from './config.ts';
export type AuthEmailSender = (message: { email: string; url: string }) => Promise<void>;
export function authEmailSender(config: AuthConfig): AuthEmailSender {
  if (config.emailMode === 'disabled') return async () => { throw new Error('Authentication email delivery is disabled.'); };
  if (config.emailMode === 'console') {
    if (config.production || process.env.NODE_ENV !== 'development' || process.env.AUTH_DEV_LOG_MAGIC_LINKS !== 'true') throw new Error('Development email cannot run in production.');
    return async ({ url }) => {
      // Explicit developer opt-in only. Never enable this sender in a production process.
      if (process.env.NODE_ENV !== 'development' || process.env.AUTH_DEV_LOG_MAGIC_LINKS !== 'true') throw new Error('Development email is disabled.');
      console.info(`[MoveIn development sign-in link — private, single-use]\n${url}`);
    };
  }
  const smtp = config.smtp!;
  const transport = nodemailer.createTransport({ host: smtp.host, port: smtp.port, secure: smtp.secure, requireTLS: true, auth: { user: smtp.user, pass: smtp.pass }, logger: false, debug: false, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000 });
  return async ({ email, url }) => {
    try { await transport.sendMail({ from: smtp.from, to: email, subject: 'Your MoveIn sign-in link', text: `Sign in to MoveIn:\n\n${url}\n\nThis link expires in 10 minutes and works once. If you did not request it, ignore this email.` }); } catch { throw new Error('Sign-in email delivery failed'); }
  };
}
