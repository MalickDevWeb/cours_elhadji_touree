export function generateRandomPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function cleanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('221') && digits.length === 12) return digits;
  if (digits.length === 9) return `221${digits}`;
  return digits.length > 0 ? digits : '221771719013';
}

export function getWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = cleanPhoneForWhatsApp(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function generateApprovalWhatsAppMsg(
  parentName: string, studentName: string, phone: string, pin: string, levelName: string = ''
): string {
  return `🎉 *Soutien Scolaire Élite - Validation de Préinscription*

Bonjour *${parentName}*,
L'inscription de votre enfant *${studentName}* ${levelName ? `(Classe: ${levelName})` : ''} a été validée avec succès par l'administration !

📱 *Vos identifiants de connexion au Portail Parent :*
- Identifiant : *${phone}*
- Code secret : *${pin}*

Pour accéder à votre espace parent (suivi des notes, absences et paiements) :
👉 https://soutien-scolaire-elite.sn

Merci de votre confiance !`;
}

export function generateResetPinWhatsAppMsg(parentName: string, phone: string, newPin: string): string {
  return `🔑 *Soutien Scolaire Élite - Votre Code Secret*

Bonjour *${parentName}*,
Voici vos identifiants pour vous connecter à votre Espace Parent :

- Téléphone : *${phone}*
- Code Secret : *${newPin}*

Vous pouvez modifier ce code à tout moment depuis vos Paramètres > Sécurité.`;
}

export function generateOtpWhatsAppMsg(parentName: string, otpCode: string): string {
  return `🔐 *Soutien Scolaire - Code de Validation*

Bonjour *${parentName}*,
Votre code de confirmation pour modifier votre code secret est : *${otpCode}*

Veuillez le saisir dans votre application pour valider la modification.`;
}
