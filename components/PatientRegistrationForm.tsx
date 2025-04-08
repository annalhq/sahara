import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const patientSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  contact_number: z.string().min(10, 'Contact number must be at least 10 characters'),
  medical_history: z.string().min(1, 'Medical history is required'),
  current_diagnosis: z.string().min(1, 'Current diagnosis is required'),
  treatment_plan: z.string().min(1, 'Treatment plan is required'),
});

export function PatientRegistrationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      const { error } = await supabase
        .from('patients')
        .insert([
          {
            ...data,
            hospital_id: session.user.id,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast.success('Patient registered successfully');
      router.push('/hospital');
    } catch (error) {
      console.error('Error registering patient:', error);
      toast.error('Failed to register patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Register New Patient</h1>
          <Button variant="outline" onClick={() => router.push('/hospital')}>
            Back to Dashboard
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                {...register('first_name')}
                placeholder="Enter first name"
              />
              {errors.first_name && (
                <p className="text-sm text-red-500">{`${errors.first_name.message}`}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                {...register('last_name')}
                placeholder="Enter last name"
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">{`${errors.last_name.message}`}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              {...register('date_of_birth')}
            />
            {errors.date_of_birth && (
              <p className="text-sm text-red-500">{`${errors.date_of_birth.message}`}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input
              id="contact_number"
              {...register('contact_number')}
              placeholder="Enter contact number"
            />
            {errors.contact_number && (
              <p className="text-sm text-red-500">{`${errors.contact_number.message}`}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_history">Medical History</Label>
            <Textarea
              id="medical_history"
              {...register('medical_history')}
              placeholder="Enter medical history"
            />
            {errors.medical_history && (
              <p className="text-sm text-red-500">{`${errors.medical_history.message}`}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_diagnosis">Current Diagnosis</Label>
            <Textarea
              id="current_diagnosis"
              {...register('current_diagnosis')}
              placeholder="Enter current diagnosis"
            />
            {errors.current_diagnosis && (
              <p className="text-sm text-red-500">{`${errors.current_diagnosis.message}`}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment_plan">Treatment Plan</Label>
            <Textarea
              id="treatment_plan"
              {...register('treatment_plan')}
              placeholder="Enter treatment plan"
            />
            {errors.treatment_plan && (
              <p className="text-sm text-red-500">{`${errors.treatment_plan.message}`}</p>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Registering Patient...' : 'Register Patient'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}