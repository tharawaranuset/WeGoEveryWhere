import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { EmailConfig } from '../config/email.config';

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: any[];
}

export interface WelcomeEmailData {
  name: string;
  email: string;
  loginUrl?: string;
}

export interface PasswordResetEmailData {
  name: string;
  email: string;
  resetUrl: string;
  expiresIn: string;
}

export interface EmailVerificationData {
  name: string;
  email: string;
  verificationUrl: string;
  expiresIn: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailConfig = this.configService.get<EmailConfig>('email');

    if (!emailConfig) {
      this.logger.error('Email configuration not found');
      throw new Error('Email configuration not found');
    }

    this.transporter = nodemailer.createTransport({
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      auth: {
        user: emailConfig.smtp.auth.user,
        pass: emailConfig.smtp.auth.pass,
      },
    });

    this.logger.log('Email service initialized with Gmail SMTP');
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    const emailConfig = this.configService.get<EmailConfig>('email');

    try {
      if (!emailConfig) {
        this.logger.error('Email configuration not found');
        throw new Error('Email configuration not found');
      }
      const mailOptions = {
        from: {
          name: emailConfig.from.name,
          address: emailConfig.from.address,
        },
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${options.to}`, {
        messageId: result.messageId,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error.stack);
      throw error;
    }
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const template = this.loadTemplate('welcome');
    const html = this.replaceTemplateVariables(template, {
      name: data.name,
      email: data.email,
      loginUrl: data.loginUrl || 'http://localhost:3000/login',
      year: new Date().getFullYear().toString(),
    });

    await this.sendEmail({
      to: data.email,
      subject: 'Welcome to WeGoEverywhere! 🚀',
      html,
      text: `Welcome to WeGoEverywhere, ${data.name}! Your account has been created successfully.`,
    });
  }

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
    const template = this.loadTemplate('password-reset');
    const html = this.replaceTemplateVariables(template, {
      name: data.name,
      email: data.email,
      resetUrl: data.resetUrl,
      expiresIn: data.expiresIn,
      year: new Date().getFullYear().toString(),
    });

    await this.sendEmail({
      to: data.email,
      subject: 'Reset Your Password - WeGoEverywhere',
      html,
      text: `Hi ${data.name}, click the following link to reset your password: ${data.resetUrl}. This link expires in ${data.expiresIn}.`,
    });
  }

  async sendEmailVerificationEmail(data: EmailVerificationData): Promise<void> {
    const template = this.loadTemplate('email-verification');
    const html = this.replaceTemplateVariables(template, {
      name: data.name,
      email: data.email,
      verificationUrl: data.verificationUrl,
      expiresIn: data.expiresIn,
      year: new Date().getFullYear().toString(),
    });

    await this.sendEmail({
      to: data.email,
      subject: 'Verify Your Email - WeGoEverywhere',
      html,
      text: `Hi ${data.name}, please verify your email address by clicking: ${data.verificationUrl}. This link expires in ${data.expiresIn}.`,
    });
  }

  private loadTemplate(templateName: string): string {
    try {
      const templatePath = path.join(
        process.cwd(),
        'src',
        'common',
        'templates',
        `${templateName}.html`,
      );

      return fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
      this.logger.error(
        `Failed to load email template: ${templateName}`,
        error.stack,
      );
      return this.getFallbackTemplate(templateName);
    }
  }

  private replaceTemplateVariables(
    template: string,
    variables: Record<string, string>,
  ): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    }
    return result;
  }

  private getFallbackTemplate(templateName: string): string {
    switch (templateName) {
      case 'welcome':
        return `
          <h1>Welcome to WeGoEverywhere, {{name}}!</h1>
          <p>Your account has been created successfully.</p>
          <p>Email: {{email}}</p>
          <p><a href="{{loginUrl}}">Login to your account</a></p>
        `;
      case 'password-reset':
        return `
          <h1>Reset Your Password</h1>
          <p>Hi {{name}},</p>
          <p>You requested to reset your password. Click the link below:</p>
          <p><a href="{{resetUrl}}">Reset Password</a></p>
          <p>This link expires in {{expiresIn}}.</p>
        `;
      case 'email-verification':
        return `
          <h1>Verify Your Email</h1>
          <p>Hi {{name}},</p>
          <p>Please verify your email address by clicking the link below:</p>
          <p><a href="{{verificationUrl}}">Verify Email</a></p>
          <p>This link expires in {{expiresIn}}.</p>
        `;
      default:
        return '<p>{{name}}, you have a new notification from WeGoEverywhere.</p>';
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('Email service connection failed', error.stack);
      return false;
    }
  }
}
