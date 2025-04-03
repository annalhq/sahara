import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
     realtime: {
          params: {
               eventsPerSecond: 10,
          },
     },
});

export function subscribeToPatients(callback: (payload: any) => void) {
     return supabase
          .channel('patients_channel')
          .on(
               'postgres_changes',
               { event: '*', schema: 'public', table: 'patients' },
               callback
          )
          .subscribe();
}

export function subscribeToNGOCapacity(callback: (payload: any) => void) {
     return supabase
          .channel('ngo_capacity_channel')
          .on(
               'postgres_changes',
               { event: '*', schema: 'public', table: 'capacity_logs' },
               callback
          )
          .subscribe();
}
