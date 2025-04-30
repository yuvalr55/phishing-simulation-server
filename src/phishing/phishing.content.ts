import { PhishingDto } from '../dto/dto.schema';
import { Document } from 'mongoose';
import * as process from 'node:process';

export const EmailContext = (dto: PhishingDto, attack: Document) => {
  const phishingLink = `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/${process.env.URL_VERSION}/phishing/track?attackId=${String(attack._id)}`;
  return {
    to: dto.email,
    subject: 'Security Alert - Suspicious Activity Detected',
    html: `
        <p>We noticed suspicious activity on your account.</p>
        <p><a href="${phishingLink}">Click here to review</a></p>
      `,
  };
};
export const default_sender_email = process.env.DEFAULT_SENDER_EMAIL;

export enum AttackStatus {
  Pending = 'pending',
}
