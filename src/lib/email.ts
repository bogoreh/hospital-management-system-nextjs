import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"Hospital Management System" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

// Email templates
export const getAppointmentReminderEmail = (
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
  location: string
) => {
  return {
    subject: 'Appointment Reminder - Hospital Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Appointment Reminder</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Dear <strong>${patientName}</strong>,</p>
          <p>This is a reminder of your upcoming appointment:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Location:</strong> ${location}</p>
          </div>
          <p>Please arrive 15 minutes before your appointment time.</p>
          <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>
          <hr style="margin: 20px 0; border-color: #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">This is an automated message. Please do not reply.</p>
        </div>
      </div>
    `,
  };
};

export const getAppointmentConfirmationEmail = (
  patientName: string,
  doctorName: string,
  date: string,
  time: string
) => {
  return {
    subject: 'Appointment Confirmed - Hospital Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10b981; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Appointment Confirmed</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Dear <strong>${patientName}</strong>,</p>
          <p>Your appointment has been confirmed:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
          </div>
          <p>We look forward to seeing you!</p>
          <hr style="margin: 20px 0; border-color: #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">This is an automated message. Please do not reply.</p>
        </div>
      </div>
    `,
  };
};

export const getAppointmentCancellationEmail = (
  patientName: string,
  doctorName: string,
  date: string,
  time: string
) => {
  return {
    subject: 'Appointment Cancelled - Hospital Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ef4444; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Appointment Cancelled</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Dear <strong>${patientName}</strong>,</p>
          <p>Your appointment has been cancelled:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
          </div>
          <p>If you did not request this cancellation, please contact us immediately.</p>
          <hr style="margin: 20px 0; border-color: #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">This is an automated message. Please do not reply.</p>
        </div>
      </div>
    `,
  };
};

export const getInvoiceEmail = (
  patientName: string,
  invoiceNumber: string,
  amount: number,
  dueDate: string
) => {
  return {
    subject: `Invoice ${invoiceNumber} - Hospital Management System`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Invoice Generated</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Dear <strong>${patientName}</strong>,</p>
          <p>A new invoice has been generated for you:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
            <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          <p>Please log in to your account to view and pay the invoice.</p>
          <hr style="margin: 20px 0; border-color: #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">This is an automated message. Please do not reply.</p>
        </div>
      </div>
    `,
  };
};