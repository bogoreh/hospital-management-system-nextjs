'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown,
  Eye,
  Download,
  Printer,
  DollarSign,
  Calendar,
  User,
  Stethoscope,
  FileText,
  X,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Wallet,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Invoice, Service, Patient, Doctor, InvoiceFormData } from '@/types';

// Sample services data
const sampleServices: Service[] = [
  { id: '1', name: 'General Consultation', category: 'consultation', price: 100, description: 'Standard doctor consultation', isActive: true },
  { id: '2', name: 'Specialist Consultation', category: 'consultation', price: 200, description: 'Specialist doctor consultation', isActive: true },
  { id: '3', name: 'Complete Blood Count', category: 'lab_test', price: 50, description: 'CBC test', isActive: true },
  { id: '4', name: 'X-Ray', category: 'lab_test', price: 150, description: 'Digital X-Ray', isActive: true },
  { id: '5', name: 'MRI Scan', category: 'lab_test', price: 500, description: 'Magnetic Resonance Imaging', isActive: true },
  { id: '6', name: 'CT Scan', category: 'lab_test', price: 400, description: 'Computed Tomography', isActive: true },
  { id: '7', name: 'ECG', category: 'procedure', price: 75, description: 'Electrocardiogram', isActive: true },
  { id: '8', name: 'Ultrasound', category: 'lab_test', price: 200, description: 'Ultrasound imaging', isActive: true },
  { id: '9', name: 'Antibiotics Course', category: 'medication', price: 30, description: 'Basic antibiotics', isActive: true },
  { id: '10', name: 'Physical Therapy', category: 'procedure', price: 120, description: 'Physical therapy session', isActive: true },
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [services, setServices] = useState<Service[]>(sampleServices);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Map<string, number>>(new Map());
  const [formData, setFormData] = useState<InvoiceFormData>({
    patientId: '',
    doctorId: '',
    services: [],
    discount: 0,
    notes: '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load sample data
  useEffect(() => {
    // Sample patients
    const samplePatients: Patient[] = [
      // {
      //   id: '1',
      //   name: 'John Doe',
      //   age: 45,
      //   gender: 'Male',
      //   phone: '+1 234 567 8900',
      //   email: 'john.doe@example.com',
      //   address: '123 Main St',
      //   bloodGroup: 'O+',
      //   medicalHistory: 'Hypertension',
      //   allergies: 'Penicillin',
      //   emergencyContact: 'Jane Doe',
      //   lastVisit: '2024-03-15',
      //   status: 'active',
      //   createdAt: new Date()
      // },
      // {
      //   id: '2',
      //   name: 'Jane Smith',
      //   age: 32,
      //   gender: 'Female',
      //   phone: '+1 234 567 8902',
      //   email: 'jane.smith@example.com',
      //   address: '456 Oak Ave',
      //   bloodGroup: 'A+',
      //   medicalHistory: 'Asthma',
      //   allergies: 'None',
      //   emergencyContact: 'Mike Smith',
      //   lastVisit: '2024-03-14',
      //   status: 'active',
      //   createdAt: new Date()
      // }
    ];

    // Sample doctors
    const sampleDoctors: Doctor[] = [
      // {
      //   id: '1',
      //   name: 'Dr. Sarah Johnson',
      //   specialization: 'Cardiology',
      //   qualification: 'MD, FACC',
      //   experience: 12,
      //   phone: '+1 234 567 8900',
      //   email: 'sarah@hospital.com',
      //   address: '123 Medical Center Dr',
      //   availableDays: ['Monday', 'Wednesday', 'Friday'],
      //   availableTime: { start: '09:00', end: '17:00' },
      //   consultationFee: 150,
      //   status: 'available',
      //   rating: 4.8,
      //   patientsCount: 1240,
      //   joinDate: new Date()
      // },
      // {
      //   id: '2',
      //   name: 'Dr. Michael Chen',
      //   specialization: 'Neurology',
      //   qualification: 'MD, PhD',
      //   experience: 15,
      //   phone: '+1 234 567 8901',
      //   email: 'michael@hospital.com',
      //   address: '456 Medical Center Dr',
      //   availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      //   availableTime: { start: '10:00', end: '18:00' },
      //   consultationFee: 200,
      //   status: 'available',
      //   rating: 4.9,
      //   patientsCount: 980,
      //   joinDate: new Date()
      // }
    ];

    // Sample invoices
    const sampleInvoices: Invoice[] = [
      // {
      //   id: '1',
      //   invoiceNumber: 'INV-2024-001',
      //   patientId: '1',
      //   patientName: 'John Doe',
      //   patientPhone: '+1 234 567 8900',
      //   patientEmail: 'john.doe@example.com',
      //   doctorId: '1',
      //   doctorName: 'Dr. Sarah Johnson',
      //   services: [
      //     { serviceId: '1', serviceName: 'General Consultation', quantity: 1, price: 100, total: 100 },
      //     { serviceId: '3', serviceName: 'Complete Blood Count', quantity: 1, price: 50, total: 50 }
      //   ],
      //   subtotal: 150,
      //   tax: 15,
      //   discount: 0,
      //   total: 165,
      //   status: 'paid',
      //   paymentMethod: 'card',
      //   paymentDate: new Date('2024-03-15'),
      //   createdAt: new Date('2024-03-15'),
      //   updatedAt: new Date('2024-03-15'),
      //   dueDate: new Date('2024-04-15')
      // },
      // {
      //   id: '2',
      //   invoiceNumber: 'INV-2024-002',
      //   patientId: '2',
      //   patientName: 'Jane Smith',
      //   patientPhone: '+1 234 567 8902',
      //   patientEmail: 'jane.smith@example.com',
      //   doctorId: '2',
      //   doctorName: 'Dr. Michael Chen',
      //   services: [
      //     { serviceId: '2', serviceName: 'Specialist Consultation', quantity: 1, price: 200, total: 200 },
      //     { serviceId: '5', serviceName: 'MRI Scan', quantity: 1, price: 500, total: 500 }
      //   ],
      //   subtotal: 700,
      //   tax: 70,
      //   discount: 50,
      //   total: 720,
      //   status: 'pending',
      //   createdAt: new Date('2024-03-18'),
      //   updatedAt: new Date('2024-03-18'),
      //   dueDate: new Date('2024-04-18')
      // }
    ];

    setPatients(samplePatients);
    setDoctors(sampleDoctors);
    setInvoices(sampleInvoices);
  }, []);

  const calculateTotals = () => {
    let subtotal = 0;
    for (const [serviceId, quantity] of selectedServices) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        subtotal += service.price * quantity;
      }
    }
    const tax = subtotal * 0.1; // 10% tax
    const discount = formData.discount;
    const total = subtotal + tax - discount;
    
    return { subtotal, tax, discount, total };
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.patientId) errors.patientId = 'Please select a patient';
    if (selectedServices.size === 0) errors.services = 'Please add at least one service';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddService = (serviceId: string) => {
    const currentQty = selectedServices.get(serviceId) || 0;
    selectedServices.set(serviceId, currentQty + 1);
    setSelectedServices(new Map(selectedServices));
  };

  const handleRemoveService = (serviceId: string) => {
    selectedServices.delete(serviceId);
    setSelectedServices(new Map(selectedServices));
  };

  const handleUpdateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      selectedServices.delete(serviceId);
    } else {
      selectedServices.set(serviceId, quantity);
    }
    setSelectedServices(new Map(selectedServices));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const selectedPatient = patients.find(p => p.id === formData.patientId);
    const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
    
    if (!selectedPatient) return;
    
    const { subtotal, tax, discount, total } = calculateTotals();
    
    const serviceList = Array.from(selectedServices.entries()).map(([serviceId, quantity]) => {
      const service = services.find(s => s.id === serviceId)!;
      return {
        serviceId,
        serviceName: service.name,
        quantity,
        price: service.price,
        total: service.price * quantity
      };
    });
    
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`,
      patientId: formData.patientId,
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      patientEmail: selectedPatient.email,
      doctorId: formData.doctorId,
      doctorName: selectedDoctor?.name,
      services: serviceList,
      subtotal,
      tax,
      discount,
      total,
      status: 'pending',
      notes: formData.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: new Date(formData.dueDate)
    };
    
    setInvoices([newInvoice, ...invoices]);
    toast.success('Invoice generated successfully!');
    resetForm();
    setShowModal(false);
  };

  const handleUpdateStatus = (id: string, newStatus: Invoice['status'], paymentMethod?: Invoice['paymentMethod']) => {
    const updatedInvoices = invoices.map(invoice =>
      invoice.id === id
        ? { 
            ...invoice, 
            status: newStatus, 
            paymentMethod: paymentMethod || invoice.paymentMethod,
            paymentDate: newStatus === 'paid' ? new Date() : invoice.paymentDate,
            updatedAt: new Date() 
          }
        : invoice
    );
    setInvoices(updatedInvoices);
    toast.success(`Invoice ${newStatus} successfully!`);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { text-align: right; margin-top: 20px; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Hospital Management System</h1>
            <p>123 Healthcare Ave, Medical City</p>
            <p>Phone: +1 234 567 8900 | Email: billing@hospital.com</p>
          </div>
          <div class="invoice-details">
            <h2>Invoice #${invoice.invoiceNumber}</h2>
            <p><strong>Patient:</strong> ${invoice.patientName}</p>
            <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr><th>Description</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${invoice.services.map(service => `
                <tr>
                  <td>${service.serviceName}</td>
                  <td>${service.quantity}</td>
                  <td>$${service.price.toFixed(2)}</td>
                  <td>$${service.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
           </table>
          <div class="total">
            <p><strong>Subtotal:</strong> $${invoice.subtotal.toFixed(2)}</p>
            <p><strong>Tax (10%):</strong> $${invoice.tax.toFixed(2)}</p>
            <p><strong>Discount:</strong> $${invoice.discount.toFixed(2)}</p>
            <h3><strong>Total:</strong> $${invoice.total.toFixed(2)}</h3>
          </div>
          <div class="footer">
            <p>Thank you for choosing our hospital!</p>
            <p>This is a computer-generated invoice.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      services: [],
      discount: 0,
      notes: '',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setSelectedServices(new Map());
    setFormErrors({});
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary statistics
  const summary = {
    totalInvoices: invoices.length,
    totalRevenue: invoices.reduce((sum, inv) => inv.status === 'paid' ? sum + inv.total : sum, 0),
    pendingAmount: invoices.reduce((sum, inv) => inv.status === 'pending' ? sum + inv.total : sum, 0),
    paidInvoices: invoices.filter(inv => inv.status === 'paid').length
  };

  const { subtotal, tax, discount, total } = calculateTotals();

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Billing & Invoices</h1>
                <p className="text-gray-600 mt-2">Manage patient billing and generate invoices</p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                New Invoice
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{summary.totalInvoices}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Total Invoices</h3>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">${summary.totalRevenue.toLocaleString()}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">${summary.pendingAmount.toLocaleString()}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Pending Amount</h3>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{summary.paidInvoices}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Paid Invoices</h3>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by patient name or invoice number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Filter className="h-5 w-5" />
                  Filters
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{invoice.patientName}</div>
                          <div className="text-sm text-gray-500">{invoice.patientPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">${invoice.total.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${getStatusColor(invoice.status)}`}>
                            {getStatusIcon(invoice.status)}
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewInvoice(invoice)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="View Invoice"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handlePrintInvoice(invoice)}
                              className="text-gray-600 hover:text-gray-800 transition-colors"
                              title="Print Invoice"
                            >
                              <Printer className="h-5 w-5" />
                            </button>
                            {invoice.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(invoice.id, 'paid', 'cash')}
                                  className="text-green-600 hover:text-green-800 transition-colors"
                                  title="Mark as Paid"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(invoice.id, 'cancelled')}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Cancel Invoice"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredInvoices.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No invoices found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Generate Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Generate New Invoice</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient *</label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.phone}
                      </option>
                    ))}
                  </select>
                  {formErrors.patientId && <p className="text-red-500 text-xs mt-1">{formErrors.patientId}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor (Optional)</label>
                  <select
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Services Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Services</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                  {services.filter(s => s.isActive).map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleAddService(service.id)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                    >
                      <div className="font-medium">{service.name}</div>
                      <div className="text-xs text-gray-500">${service.price}</div>
                    </button>
                  ))}
                </div>
                
                {formErrors.services && <p className="text-red-500 text-xs mt-1">{formErrors.services}</p>}
              </div>

              {/* Selected Services List */}
              {selectedServices.size > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selected Services</label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Service</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Array.from(selectedServices.entries()).map(([serviceId, quantity]) => {
                          const service = services.find(s => s.id === serviceId)!;
                          return (
                            <tr key={serviceId}>
                              <td className="px-4 py-2 text-sm">{service.name}</td>
                              <td className="px-4 py-2 text-sm">${service.price}</td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  min="1"
                                  value={quantity}
                                  onChange={(e) => handleUpdateQuantity(serviceId, parseInt(e.target.value) || 0)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-4 py-2 text-sm font-medium">${(service.price * quantity).toFixed(2)}</td>
                              <td className="px-4 py-2">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveService(serviceId)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Discount and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    rows={2}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              {/* Totals */}
              {selectedServices.size > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (10%):</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Discount:</span>
                      <span className="font-medium">${discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                  Generate Invoice
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Invoice Details</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePrintInvoice(selectedInvoice)}
                  className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button onClick={() => setShowInvoiceModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Invoice Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Hospital Management System</h1>
                <p className="text-gray-600">123 Healthcare Ave, Medical City</p>
                <p className="text-gray-600">Phone: +1 234 567 8900 | Email: billing@hospital.com</p>
              </div>

              {/* Invoice Info */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Invoice Number</p>
                  <p className="font-semibold">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                    {getStatusIcon(selectedInvoice.status)}
                    {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Invoice Date</p>
                  <p className="font-semibold">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-semibold">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Patient Information
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-500">Name:</span> {selectedInvoice.patientName}</p>
                    <p><span className="text-gray-500">Phone:</span> {selectedInvoice.patientPhone}</p>
                    <p><span className="text-gray-500">Email:</span> {selectedInvoice.patientEmail}</p>
                  </div>
                </div>
                {selectedInvoice.doctorName && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Doctor Information
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Name:</span> {selectedInvoice.doctorName}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Services Table */}
              <table className="w-full mb-6">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Unit Price</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedInvoice.services.map((service, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-sm">{service.serviceName}</td>
                      <td className="px-4 py-2 text-sm">{service.quantity}</td>
                      <td className="px-4 py-2 text-sm">${service.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm font-medium">${service.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-6">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (10%):</span>
                    <span>${selectedInvoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount:</span>
                    <span>${selectedInvoice.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                    <span>Total:</span>
                    <span>${selectedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Notes:</p>
                  <p className="text-sm">{selectedInvoice.notes}</p>
                </div>
              )}

              {selectedInvoice.paymentDate && (
                <div className="text-center text-sm text-gray-500">
                  Payment Date: {new Date(selectedInvoice.paymentDate).toLocaleDateString()}
                </div>
              )}

              <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
                Thank you for choosing our hospital!
              </div>

              {/* Action Buttons for Payment */}
              {selectedInvoice.status === 'pending' && (
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedInvoice.id, 'paid', 'cash');
                      setShowInvoiceModal(false);
                    }}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Wallet className="h-4 w-4" />
                    Mark as Paid (Cash)
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedInvoice.id, 'paid', 'card');
                      setShowInvoiceModal(false);
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Mark as Paid (Card)
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedInvoice.id, 'cancelled');
                      setShowInvoiceModal(false);
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Cancel Invoice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}