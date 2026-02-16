import React, { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/client';

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
          role: 'learner'
        },
        {
          email: 'demo.instructor@cerebrolearn.com',
          password: 'demo123456',
          full_name: 'Demo Instructor',
          role: 'instructor'
        },
        {
          email: 'demo.admin@cerebrolearn.com',
          password: 'demo123456',
          full_name: 'Demo Admin',
          role: 'admin'
        }
      ];

      const supabase = createClient();
      let successCount = 0;

      for (const account of demoAccounts) {
        try {
          // Use Supabase Auth directly - no backend call needed
          const { data, error } = await supabase.auth.signUp({
            email: account.email,
            password: account.password,
            options: {
              data: {
                full_name: account.full_name,
                role: account.role
              }
            }
          });

          if (error) {
            // Account might already exist, which is fine
            console.log(`Demo account ${account.email} might already exist:`, error.message);
          } else if (data.user) {
            console.log(`✓ Created demo account: ${account.email}`);
            successCount++;
            
            // Store profile in localStorage
            const profile = {
              id: data.user.id,
              email: account.email,
              full_name: account.full_name,
              role: account.role,
              org_id: null,
              avatar: null,
              xp: 0,
              streak: 0,
              badges: [],
              created_at: data.user.created_at || new Date().toISOString()
            };
            
            try {
              localStorage.setItem(`cerebrolearn_profile_${data.user.id}`, JSON.stringify(profile));
            } catch (e) {
              console.log('Failed to store profile in localStorage');
            }
          }
        } catch (error) {
          console.log(`Error creating demo account ${account.email}:`, error);
        }
      }

      // Mark as seeded even if some accounts failed (they might already exist)
      localStorage.setItem('cerebrolearn_demo_seeded', 'true');
      setSeeded(true);
      
      if (successCount > 0) {
        console.log(`✓ Demo accounts created successfully! You can now use the "Demo" buttons to login.`);
      }
    };

    seedDemoAccounts();
  }, []);

  return null; // This component doesn't render anything
}