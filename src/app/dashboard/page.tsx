'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { Users, Stethoscope, Calendar, Activity, TrendingUp, TrendingDown, Download, FileText, Printer } from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { exportAppointmentsToPDF, exportPatientsToPDF, exportInvoicesToPDF } from '@/utils/exportPDF';
import { Appointment, Patient, Invoice } from '@/types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export default function DashboardPage() {
  const [stats] = useState({
    totalPatients: 1247,
    appointmentsToday: 28,
    doctorsAvailable: 32,
    revenueThisMonth: 84500
  });

  const [previousStats] = useState({
    totalPatients: 1120,
    appointmentsToday: 24,
    doctorsAvailable: 30,
    revenueThisMonth: 78900
  });

  const [isExporting, setIsExporting] = useState(false);

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0
    };
  };

  // Sample data for exports - matching the Appointment interface
  const sampleAppointments: Appointment[] = [
    {
      id: '1',
      patientId: 'P001',
      patientName: 'John Doe',
      patientPhone: '+1 234 567 8900',
      patientEmail: 'john@example.com',
      doctorId: 'D001',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialization: 'Cardiology',
      date: '2024-03-20',
      time: '10:00 AM',
      duration: 30,
      status: 'confirmed',
      symptoms: 'Chest pain',
      notes: 'Follow-up required',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      patientId: 'P002',
      patientName: 'Jane Smith',
      patientPhone: '+1 234 567 8902',
      patientEmail: 'jane@example.com',
      doctorId: 'D002',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialization: 'Neurology',
      date: '2024-03-20',
      time: '11:30 AM',
      duration: 30,
      status: 'pending',
      symptoms: 'Headaches',
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      patientId: 'P003',
      patientName: 'Robert Brown',
      patientPhone: '+1 234 567 8904',
      patientEmail: 'robert@example.com',
      doctorId: 'D003',
      doctorName: 'Dr. Emily Davis',
      doctorSpecialization: 'Pediatrics',
      date: '2024-03-20',
      time: '01:00 PM',
      duration: 30,
      status: 'confirmed',
      symptoms: 'Fever',
      notes: 'Bring medical records',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ];

  // Sample patients data
  const samplePatients: Patient[] = [
    {
      id: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      phone: '+1 234 567 8900',
      email: 'john@example.com',
      address: '123 Main St',
      bloodGroup: 'O+',
      medicalHistory: 'Hypertension',
      allergies: 'Penicillin',
      emergencyContact: 'Jane Doe - 1234567890',
      lastVisit: '2024-03-15',
      status: 'active',
      createdAt: new Date()
    },
    {
      id: 'P002',
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      phone: '+1 234 567 8902',
      email: 'jane@example.com',
      address: '456 Oak Ave',
      bloodGroup: 'A+',
      medicalHistory: 'Asthma',
      allergies: 'None',
      emergencyContact: 'Mike Smith - 1234567891',
      lastVisit: '2024-03-14',
      status: 'active',
      createdAt: new Date()
    },
    {
      id: 'P003',
      name: 'Robert Brown',
      age: 58,
      gender: 'Male',
      phone: '+1 234 567 8904',
      email: 'robert@example.com',
      address: '789 Pine Rd',
      bloodGroup: 'B+',
      medicalHistory: 'Diabetes',
      allergies: 'Sulfa',
      emergencyContact: 'Mary Brown - 1234567892',
      lastVisit: '2024-03-10',
      status: 'active',
      createdAt: new Date()
    },
  ];

  // Sample invoices data
  const sampleInvoices: Invoice[] = [
    {
      id: 'INV001',
      invoiceNumber: 'INV-2024-001',
      patientId: 'P001',
      patientName: 'John Doe',
      patientPhone: '+1 234 567 8900',
      patientEmail: 'john@example.com',
      doctorId: 'D001',
      doctorName: 'Dr. Sarah Johnson',
      services: [
        {
          serviceId: 'S001',
          serviceName: 'Consultation',
          quantity: 1,
          price: 100,
          total: 100
        }
      ],
      subtotal: 100,
      tax: 10,
      discount: 0,
      total: 110,
      status: 'paid',
      paymentMethod: 'card',
      paymentDate: new Date(),
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: new Date()
    },
    {
      id: 'INV002',
      invoiceNumber: 'INV-2024-002',
      patientId: 'P002',
      patientName: 'Jane Smith',
      patientPhone: '+1 234 567 8902',
      patientEmail: 'jane@example.com',
      doctorId: 'D002',
      doctorName: 'Dr. Michael Chen',
      services: [
        {
          serviceId: 'S002',
          serviceName: 'Lab Tests',
          quantity: 1,
          price: 200,
          total: 200
        }
      ],
      subtotal: 200,
      tax: 20,
      discount: 10,
      total: 210,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: new Date()
    },
  ];

  // Bar Chart Data - Weekly Appointments
  const weeklyAppointmentsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Appointments',
        data: [42, 48, 53, 47, 51, 38, 29],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Line Chart Data - Patient Growth
  const patientGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Patients',
        data: [65, 72, 88, 95, 110, 125, 140, 155, 170, 185, 200, 215],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Doughnut Chart Data - Patient Distribution by Department
  const departmentData = {
    labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Others'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: 'white',
        borderWidth: 2,
        cutout: '60%',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
          },
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 20,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 11,
          },
          padding: 15,
        },
      },
    },
  };

  // Export handlers
  const handleExportAppointments = async () => {
    setIsExporting(true);
    try {
      await exportAppointmentsToPDF(sampleAppointments, 'Dashboard_Appointments_Report');
      toast.success('Appointments report exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export appointments report');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPatients = async () => {
    setIsExporting(true);
    try {
      await exportPatientsToPDF(samplePatients, 'Dashboard_Patients_Report');
      toast.success('Patients report exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export patients report');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportInvoices = async () => {
    setIsExporting(true);
    try {
      await exportInvoicesToPDF(sampleInvoices, 'Dashboard_Revenue_Report');
      toast.success('Revenue report exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export revenue report');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const overviewCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      change: calculateChange(stats.totalPatients, previousStats.totalPatients),
    },
    {
      title: 'Appointments Today',
      value: stats.appointmentsToday,
      icon: Calendar,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      change: calculateChange(stats.appointmentsToday, previousStats.appointmentsToday),
    },
    {
      title: 'Doctors Available',
      value: stats.doctorsAvailable,
      icon: Stethoscope,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      change: calculateChange(stats.doctorsAvailable, previousStats.doctorsAvailable),
    },
    {
      title: 'Revenue (Monthly)',
      value: `$${stats.revenueThisMonth.toLocaleString()}`,
      icon: Activity,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      change: calculateChange(stats.revenueThisMonth, previousStats.revenueThisMonth),
    },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {/* Header with Export Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-dark-text">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's what's happening today.</p>
              </div>
              
              {/* Export Dropdown */}
              <div className="relative group">
                <button
                  disabled={isExporting}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Download className="h-5 w-5" />
                  {isExporting ? 'Exporting...' : 'Export Reports'}
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-lg shadow-lg border border-gray-200 dark:border-dark-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <div className="py-2">
                    <button
                      onClick={handleExportAppointments}
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Export Appointments
                    </button>
                    <button
                      onClick={handleExportPatients}
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Export Patients List
                    </button>
                    <button
                      onClick={handleExportInvoices}
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Export Revenue Report
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-dark-border" />
                    <button
                      onClick={handlePrint}
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Print Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {overviewCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${card.bgColor} p-3 rounded-lg`}>
                        <Icon className={`h-6 w-6 ${card.textColor}`} />
                      </div>
                      <div className={`flex items-center gap-1 ${card.change.isPositive ? 'text-green-600' : 'text-red-600'} text-sm font-medium`}>
                        {card.change.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span>{card.change.value}%</span>
                      </div>
                    </div>
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">{card.title}</h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-dark-text mt-1">{card.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Weekly Appointments Chart */}
              <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text">Weekly Appointments</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Appointment distribution this week</p>
                </div>
                <div className="h-80">
                  <Bar data={weeklyAppointmentsData} options={barChartOptions} />
                </div>
              </div>

              {/* Patient Growth Chart */}
              <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text">Patient Growth</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monthly new patient registration</p>
                </div>
                <div className="h-80">
                  <Line data={patientGrowthData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department Distribution */}
              <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text">Patient Distribution by Department</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Percentage of patients per department</p>
                </div>
                <div className="h-80 flex items-center justify-center">
                  <Doughnut data={departmentData} options={doughnutOptions} />
                </div>
              </div>

              {/* Recent Activity / Upcoming Appointments */}
              <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-dark-text">Upcoming Appointments</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Next 5 appointments</p>
                </div>
                <div className="space-y-4">
                  {[
                    { patient: 'John Doe', doctor: 'Dr. Sarah Johnson', time: '10:00 AM', type: 'Cardiology Checkup' },
                    { patient: 'Emma Wilson', doctor: 'Dr. Michael Chen', time: '11:30 AM', type: 'Neurology Consultation' },
                    { patient: 'Robert Brown', doctor: 'Dr. Emily Davis', time: '01:00 PM', type: 'Pediatric Vaccination' },
                    { patient: 'Lisa Anderson', doctor: 'Dr. James Wilson', time: '02:30 PM', type: 'Orthopedic Follow-up' },
                    { patient: 'David Miller', doctor: 'Dr. Sarah Johnson', time: '04:00 PM', type: 'Cardiology Review' },
                  ].map((appointment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-800 dark:text-dark-text">{appointment.patient}</p>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{appointment.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.doctor}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{appointment.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Stats Bar */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <p className="text-sm opacity-90">Patient Satisfaction</p>
                <p className="text-2xl font-bold mt-1">94%</p>
                <p className="text-xs opacity-80 mt-1">↑ 5% from last month</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                <p className="text-sm opacity-90">Average Wait Time</p>
                <p className="text-2xl font-bold mt-1">12 min</p>
                <p className="text-xs opacity-80 mt-1">↓ 3 min from last month</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <p className="text-sm opacity-90">Bed Occupancy</p>
                <p className="text-2xl font-bold mt-1">78%</p>
                <p className="text-xs opacity-80 mt-1">156/200 beds occupied</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <p className="text-sm opacity-90">Emergency Cases</p>
                <p className="text-2xl font-bold mt-1">8</p>
                <p className="text-xs opacity-80 mt-1">Today's emergencies</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}