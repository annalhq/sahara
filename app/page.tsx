"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Users, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    {
      value: "2,547",
      label: "Patients Helped",
      icon: Heart,
      description: "Lives transformed through our collaborative care network",
    },
    {
      value: "180+",
      label: "Partner Hospitals",
      icon: Building2,
      description:
        "Medical facilities working together to provide quality care",
    },
    {
      value: "95+",
      label: "NGO Partners",
      icon: Users,
      description:
        "Organizations committed to patient rehabilitation and support",
    },
  ];


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with animated entrance */}
      <main className="flex-grow">
        <div className="relative isolate">
          {/* Background gradient with improved animation */}
          <div
            className="absolute inset-x-0 top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-pulse"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                animationDuration: "8s",
              }}
            />
          </div>

          {/* Hero content with animation */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center animate-fadeIn">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Bridging Healthcare & Hope
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl mx-auto">
                Connecting hospitals with NGOs to ensure successful
                rehabilitation and reintegration of leprosy patients into
                society.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/hospital" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="gap-2 w-full px-8 py-6 text-lg hover:scale-105 transition-transform"
                  >
                    Hospital Portal{" "}
                    <ArrowRight className="h-4 w-4 animate-bounce-horizontal" />
                  </Button>
                </Link>
                <Link href="/ngo" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 w-full px-8 py-6 text-lg hover:scale-105 transition-transform"
                  >
                    NGO Portal{" "}
                    <ArrowRight className="h-4 w-4 animate-bounce-horizontal" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section with hover effects */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:border-primary/50 group"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-3 bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-4 text-3xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground/80 hidden group-hover:block transition-all">
                    {stat.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>


        {/* Call to Action Section */}
        <div className="relative isolate overflow-hidden bg-primary/10 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to make a difference?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                Join our network of healthcare providers and NGOs working
                together to transform lives.
              </p>
              <div className="mt-8 flex items-center justify-center gap-x-4">
                <Button size="lg" className="px-6">
                  Get Started
                </Button>
                <Button variant="outline" size="lg" className="px-6">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
