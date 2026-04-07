import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Appointment, Patient, Doctor, Invoice } from '@/types';

export const exportAppointmentsToPDF = (appointments: Appointment[], title: string) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  // Prepare table data
  const tableData = appointments.map(app => [
    app.date,
    app.time,
    app.patientName,
    app.doctorName,
    app.doctorSpecialization,
    app.status.toUpperCase(),
  ]);
  
  // Add table
  autoTable(doc, {
    head: [['Date', 'Time', 'Patient', 'Doctor', 'Department', 'Status']],
    body: tableData,
    startY: 40,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });
  
  // Save PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

export const exportPatientsToPDF = (patients: Patient[], title: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  const tableData = patients.map(patient => [
    patient.name,
    patient.age.toString(),
    patient.gender,
    patient.phone,
    patient.email,
    patient.bloodGroup,
    patient.status.toUpperCase(),
  ]);
  
  autoTable(doc, {
    head: [['Name', 'Age', 'Gender', 'Phone', 'Email', 'Blood Group', 'Status']],
    body: tableData,
    startY: 40,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
  });
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

export const exportInvoicesToPDF = (invoices: Invoice[], title: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  const tableData = invoices.map(invoice => [
    invoice.invoiceNumber,
    invoice.patientName,
    `$${invoice.subtotal.toFixed(2)}`,
    `$${invoice.tax.toFixed(2)}`,
    `$${invoice.discount.toFixed(2)}`,
    `$${invoice.total.toFixed(2)}`,
    invoice.status.toUpperCase(),
    new Date(invoice.createdAt).toLocaleDateString(),
  ]);
  
  autoTable(doc, {
    head: [['Invoice #', 'Patient', 'Subtotal', 'Tax', 'Discount', 'Total', 'Status', 'Date']],
    body: tableData,
    startY: 40,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
  });
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};