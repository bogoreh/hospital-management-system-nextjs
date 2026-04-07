import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    doctorsAvailable: 0,
    revenueThisMonth: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total patients
        const patientsSnapshot = await getDocs(collection(db, 'patients'));
        const totalPatients = patientsSnapshot.size;

        // Fetch today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('date', '>=', Timestamp.fromDate(today)),
          where('date', '<', Timestamp.fromDate(tomorrow))
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const appointmentsToday = appointmentsSnapshot.size;

        // Fetch doctors
        const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
        const doctorsAvailable = doctorsSnapshot.size;

        setStats({
          totalPatients,
          appointmentsToday,
          doctorsAvailable,
          revenueThisMonth: 84500, // This would come from your revenue collection
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { stats, loading };
};