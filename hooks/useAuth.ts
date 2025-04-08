import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useAuth(redirectTo?: string) {
     const [session, setSession] = useState<any>(null);
     const [loading, setLoading] = useState(true);
     const router = useRouter();

     useEffect(() => {
          async function getSession() {
               setLoading(true);
               try {
                    const { data, error } = await supabase.auth.getSession();

                    if (error) {
                         throw error;
                    }

                    setSession(data.session);

                    if (!data.session && redirectTo) {
                         router.push(redirectTo);
                    }
               } catch (error) {
                    console.error('Error getting session:', error);
                    toast.error('Authentication error');
               } finally {
                    setLoading(false);
               }
          }

          getSession();

          const { data: authListener } = supabase.auth.onAuthStateChange(
               async (event, session) => {
                    setSession(session);
                    if (!session && redirectTo) {
                         router.push(redirectTo);
                    }
               }
          );

          return () => {
               if (authListener && authListener.subscription) {
                    authListener.subscription.unsubscribe();
               }
          };
     }, [redirectTo, router]);

     return { session, loading, isAuthenticated: !!session };
}
