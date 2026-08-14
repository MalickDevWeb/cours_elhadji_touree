import { Router } from 'express';
import { brevoEmailService } from './services/BrevoEmailService';

export const emailRouter = Router();

emailRouter.get('/email/status', (_req, res) => {
  res.json(brevoEmailService.getStatus());
});

emailRouter.post('/email/send', async (req, res) => {
  try {
    const { toEmail, toName, subject, htmlContent, textContent } = req.body;
    if (!toEmail || !subject || (!htmlContent && !textContent)) {
      return res.status(400).json({ error: 'champs requis: toEmail, subject, htmlContent' });
    }

    const result = await brevoEmailService.sendEmail({
      toEmail,
      toName,
      subject,
      htmlContent: htmlContent || `<p>${textContent}</p>`,
      textContent,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({ success: true, messageId: result.messageId });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erreur interne envoi email' });
  }
});

emailRouter.post('/email/test', async (req, res) => {
  try {
    const { targetEmail } = req.body;
    const emailTo = targetEmail || process.env.SENDER_EMAIL || 'malickteuw.devweb@gmail.com';

    const result = await brevoEmailService.sendEmail({
      toEmail: emailTo,
      subject: '🎓 Test Envoi Email - Centre de Soutien Scolaire',
      htmlContent: `
        <div style="font-family: sans-serif; padding: 20px; background: #f8fafc; border-radius: 12px; color: #1e293b;">
          <h2 style="color: #0284c7; margin-top: 0;">Test d'intégration Brevo réussi !</h2>
          <p>Bonjour,</p>
          <p>Ceci est un email de confirmation envoyé via l'API Brevo de votre application <strong>Centre de Soutien Scolaire</strong>.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">Date du test: ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `,
    });

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    res.json({ success: true, message: `Email de test envoyé à ${emailTo}`, messageId: result.messageId });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message });
  }
});
