"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    organizationType: "ngo", // Default to NGO, could be "hospital" or "ngo"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            organization_type: formData.organizationType,
          },
        },
      });

      if (error) throw error;

      toast.success(
        "Registration successful! Please check your email for verification."
      );

      // Redirect to login page
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Organization Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <Input
                  type="radio"
                  id="type-ngo"
                  name="organizationType"
                  value="ngo"
                  checked={formData.organizationType === "ngo"}
                  onChange={handleChange}
                  className="w-4 h-4 mr-2"
                />
                <Label htmlFor="type-ngo">NGO</Label>
              </div>

              <div className="flex items-center">
                <Input
                  type="radio"
                  id="type-hospital"
                  name="organizationType"
                  value="hospital"
                  checked={formData.organizationType === "hospital"}
                  onChange={handleChange}
                  className="w-4 h-4 mr-2"
                />
                <Label htmlFor="type-hospital">Hospital</Label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
