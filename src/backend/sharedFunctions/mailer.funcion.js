import nodemailer from 'nodemailer';
import { getMailTemplate } from './mailTemplate.js';

export async function sendPasswordMail(destinatario, contraseña) {
    let asunto = 'Contraseña temporal QNave';
    
  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '', 
        pass: ''        
      }
    });

    const mailOptions = {
      from: '',   
      to: destinatario,              
      subject: asunto,               
      html: getMailTemplate(contraseña)  
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: ' + info.response);
    return info.response;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
}



