export class BrevoEmailService {
  private apiKey: string | null = null;
  private senderEmail = 'malickteuw.devweb@gmail.com';

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || null;
    if (process.env.SENDER_EMAIL) {
      this.senderEmail = process.env.SENDER_EMAIL;
    }
  }

  public getStatus() {
    return {
      configured: !!this.apiKey,
      senderEmail: this.senderEmail,
    };
  }

  public async sendEmail(params: {
    toEmail: string;
    toName?: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    emailNotificationsEnabled?: boolean;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (params.emailNotificationsEnabled === false) {
      return { success: false, error: "Notifications e-mail désactivées pour ce destinataire (Économie Brevo)." };
    }
    if (!this.apiKey) {
      return { success: false, error: "BREVO_API_KEY non configurée" };
    }

    try {
      const response = await globalThis.fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Centre de Soutien Scolaire', email: this.senderEmail },
          to: [{ email: params.toEmail, name: params.toName || params.toEmail }],
          subject: params.subject,
          htmlContent: params.htmlContent,
          textContent: params.textContent,
        }),
      });

      const data = (await response.json()) as any;
      if (!response.ok) {
        return { success: false, error: data?.message || `HTTP ${response.status}` };
      }
      return { success: true, messageId: data?.messageId };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erreur réseau vers Brevo API' };
    }
  }
}

export const brevoEmailService = new BrevoEmailService();
