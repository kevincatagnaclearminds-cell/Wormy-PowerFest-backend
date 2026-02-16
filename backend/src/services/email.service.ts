import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurar el transporter de nodemailer
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendQREmail(email: string, firstName: string, lastName: string, ticketId: string) {
    try {
      // Generar QR como imagen base64
      const qrCodeDataURL = await QRCode.toDataURL(ticketId);
      const qrBase64 = qrCodeDataURL.split(',')[1];

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: '🎉 Tu Ticket para Wormy PowerFest',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4CAF50;">¡Registro Exitoso! 🎉</h1>
            <p>Hola <strong>${firstName} ${lastName}</strong>,</p>
            <p>Tu registro para <strong>Wormy PowerFest</strong> ha sido confirmado.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h2>Tu Código QR</h2>
              <img src="cid:qrcode" alt="QR Code" style="max-width: 300px;" />
              <p style="color: #666; font-size: 12px; margin-top: 10px;">
                ID: ${ticketId}
              </p>
            </div>

            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;"><strong>⚠️ Importante:</strong></p>
              <ul style="margin: 10px 0;">
                <li>Guarda este QR en tu celular</li>
                <li>Preséntalo al ingresar al evento</li>
                <li>No compartas tu QR con otras personas</li>
              </ul>
            </div>

            <p style="color: #666; font-size: 14px;">
              ¡Nos vemos en el evento! 🏃‍♂️💪🏊‍♂️
            </p>
          </div>
        `,
        attachments: [
          {
            filename: 'qr-code.png',
            content: qrBase64,
            encoding: 'base64',
            cid: 'qrcode'
          }
        ]
      };

      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Email enviado exitosamente' };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, message: 'Error al enviar email' };
    }
  }

  async sendQRWhatsApp(phone: string, firstName: string, ticketId: string) {
    // Para WhatsApp, generamos un link que abre WhatsApp Web con mensaje pre-llenado
    const message = `¡Hola ${firstName}! 🎉\n\nTu registro para Wormy PowerFest ha sido confirmado.\n\n✅ Tu código de ticket es: ${ticketId}\n\n📱 Guarda este mensaje y presenta tu QR al ingresar al evento.\n\n¡Nos vemos pronto! 🏃‍♂️💪`;
    
    // Retornamos el link de WhatsApp para que el frontend lo abra
    const whatsappLink = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    return {
      success: true,
      whatsappLink,
      message: 'Link de WhatsApp generado'
    };
  }
}
