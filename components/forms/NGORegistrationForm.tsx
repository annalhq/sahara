"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ngoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contact_number: z
    .string()
    .min(10, "Contact number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  license_number: z
    .string()
    .min(5, "License number must be at least 5 characters"),
  total_capacity: z.number().min(1, "Capacity must be at least 1"),
  service_areas: z.string().min(2, "Service areas required"),
});

export function NGORegistrationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ngoSchema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("ngos").insert([
        {
          ...data,
          service_areas: data.service_areas
            .split(",")
            .map((area: string) => area.trim()),
          current_capacity: data.total_capacity,
          verified: false,
        },
      ]);

      if (error) throw error;

      toast.success("NGO registered successfully");
      router.push("/ngo");
    } catch (error) {
      toast.error("Failed to register NGO");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">NGO Registration</h1>
          <Button variant="outline" onClick={() => router.push("/ngo")}>
            Back to Dashboard
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter organization name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{`${errors.name.message}`}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Enter complete address"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{`${errors.address.message}`}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_number">Contact Number</Label>
              <Input
                id="contact_number"
                {...register("contact_number")}
                placeholder="Enter contact number"
              />
              {errors.contact_number && (
                <p className="text-sm text-red-500">{`${errors.contact_number.message}`}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{`${errors.email.message}`}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="license_number">License Number</Label>
            <Input
              id="license_number"
              {...register("license_number")}
              placeholder="Enter license number"
            />
            {errors.license_number && (
              <p className="text-sm text-red-500">{`${errors.license_number.message}`}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_capacity">Total Capacity</Label>
              <Input
                id="total_capacity"
                type="number"
                {...register("total_capacity", { valueAsNumber: true })}
                placeholder="Enter total capacity"
              />
              {errors.total_capacity && (
                <p className="text-sm text-red-500">{`${errors.total_capacity.message}`}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_areas">Service Areas</Label>
              <Input
                id="service_areas"
                {...register("service_areas")}
                placeholder="Enter service areas (comma-separated)"
              />
              {errors.service_areas && (
                <p className="text-sm text-red-500">{`${errors.service_areas.message}`}</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register NGO"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
