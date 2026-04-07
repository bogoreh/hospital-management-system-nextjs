import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getAppointmentReminderEmail, getAppointmentConfirmationEmail, getAppointmentCancellationEmail, getInvoiceEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let emailOptions;

    switch (type) {
      case 'appointment_reminder':
        emailOptions = getAppointmentReminderEmail(
          data.patientName,
          data.doctorName,
          data.date,
          data.time,
          data.location
        );
        break;
      case 'appointment_confirmation':
        emailOptions = getAppointmentConfirmationEmail(
          data.patientName,
          data.doctorName,
          data.date,
          data.time
        );
        break;
      case 'appointment_cancellation':
        emailOptions = getAppointmentCancellationEmail(
          data.patientName,
          data.doctorName,
          data.date,
          data.time
        );
        break;
      case 'invoice':
        emailOptions = getInvoiceEmail(
          data.patientName,
          data.invoiceNumber,
          data.amount,
          data.dueDate
        );
        break;
      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    const result = await sendEmail({
      to: data.patientEmail,
      subject: emailOptions.subject,
      html: emailOptions.html,
    });

    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}