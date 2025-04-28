import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PhishingDto } from '../dto/dto.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserAttacked, UserAttackedDocument } from '../user/user.schema';
import { UpdateAttackStatusQueries } from './phishing.query';
import {
  EmailContext,
  AttackStatus,
  default_sender_email,
} from './phishing.content';
import { Logger } from '@nestjs/common';

@Injectable()
/** Service handling phishing attack simulation and tracking. */
export class PhishingService {
  /** Default email address used when no sender is specified. */
  private readonly defaultEmail = default_sender_email;
  private readonly logger = new Logger(PhishingService.name);

  /** Initializes PhishingService with dependencies for mailing and database operations. */
  constructor(
    /** Service used to send emails. */
    private readonly mailerService: MailerService,
    /** Mongoose model for UserAttacked documents. */
    @InjectModel(UserAttacked.name)
    private readonly attackModel: Model<UserAttackedDocument>,
    /** Queries to generate update operations for attack status. */
    @Inject('UpdateAttackStatusQueries')
    private readonly updateAttackStatusQueries: typeof UpdateAttackStatusQueries,
    /** Email content generator for phishing emails. */
    @Inject('EmailContext')
    private readonly emailContext: typeof EmailContext,
  ) {}

  /** Sends a phishing email and stores the attack information. */
  async sendPhishingEmail(dto: PhishingDto): Promise<{ message: string }> {
    const attack = await this.attackModel.create({
      source: process.env.MAIL_USER || this.defaultEmail,
      target: dto.email,
      status: AttackStatus.Pending,
    });
    this.logger.log('Attack record created successfully:', attack._id);
    this.logger.log('pre send phishingEmail');
    try {
      await this.mailerService.sendMail(this.emailContext(dto, attack));
      this.logger.log('Phishing email sent successfully.');
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to send phishing email:', error.message);
      } else {
        this.logger.error('Failed to send phishing email:', error);
      }
      throw new Error(
        'Failed to send phishing email. Please check SMTP credentials.',
      );
    }

    return { message: `Phishing email sent to ${dto.email}` };
  }

  /** Updates the status of a phishing attack record. */
  async updateAttackStatus(attackId: string): Promise<void> {
    const { query, update } = this.updateAttackStatusQueries(attackId);
    const result = await this.attackModel.updateOne(query, update);
    this.logger.log(
      'Attack status updated successfully for attack ID:',
      attackId,
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Attack not found');
    }
  }

  /** Retrieves all phishing attack records from the database. */
  async tableAttackStatus(): Promise<UserAttacked[]> {
    const records = await this.attackModel.find().exec();
    this.logger.log('Fetched all attack records from the database.');
    return records;
  }
}
