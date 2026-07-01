import React, { useEffect, useState } from 'react';
import { authApi } from '../../utils/api-client';

export function DemoAccountSeeder() {
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const seedDemoAccounts = async () => {
      const seededFlag = localStorage.getItem('cerebrolearn_demo_seeded');

      if (seededFlag) {
        setSeeded(true);
        return;
      }

      console.log('Creating demo accounts...');

      const demoAccounts = [
        {
          email: 'demo.learner@cerebrolearn.com',
          password: 'demo123456',
          full_name: 'Demo Learner',
          role: 'learner',
        },
        {
          email: 'demo.instructor@cerebrolearn.com',
          password: 'demo123456',
          full_name: 'Demo Instructor',
          role: 'instructor',
        },
        {
          email: 'demo.admin@cerebrolearn.com',
          password: 'demo123456',
          full_name: 'Demo Admin',
          role: 'admin',
        },
      ];

      let successCount = 0;

      for (const account of demoAccounts) {
        try {
          await authApi.signup(account);
          console.log(`✓ Created demo account: ${account.email}`);
          successCount++;
        } catch (error) {
          // Account might already exist, which is fine
          console.log(
            `Demo account ${account.email} might already exist:`,
            error,
          );
        }
      }

      // Mark as seeded even if some accounts failed (they might already exist)
      localStorage.setItem('cerebrolearn_demo_seeded', 'true');
      setSeeded(true);

      if (successCount > 0) {
        console.log(
          `✓ Demo accounts created successfully! You can now use the "Demo" buttons to login.`,
        );
      }
    };

    seedDemoAccounts();
  }, []);

  return null; // This component doesn't render anything
}
