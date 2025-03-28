"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Users, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const stats = [
    {
      value: "2,547",
      label: "Patients Helped",
      icon: Heart,
    },
    {
      value: "180+",
      label: "Partner Hospitals",
      icon: Building2,
    },
    {
      value: "95+",
      label: "NGO Partners",
      icon: Users,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative isolate">
          {/* Background gradient */}
          <div
            className="absolute inset-x-0 top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>

          {/* Hero content */}
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Bridging Healthcare & Hope
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Connecting hospitals with NGOs to ensure successful rehabilitation and reintegration of leprosy patients into society.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/hospital">
                  <Button size="lg" className="gap-2">
                    Hospital Portal <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/ngo">
                  <Button size="lg" variant="outline" className="gap-2">
                    NGO Portal <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mx-auto max-w-7xl px-6 pb-24 sm:pb-32 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center">
                <stat.icon className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-4 text-3xl font-semibold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="bg-muted py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Success Stories</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Real stories of hope, healing, and successful rehabilitation
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {/* Success Story Cards */}
              {[1, 2, 3].map((_, index) => (
                <Card key={index} className="flex flex-col overflow-hidden">
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-x-4">
                      <img
                        src={`https://source.unsplash.com/random/400x300?healing&${index}`}
                        alt="Success story"
                        className="h-48 w-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold leading-6">A New Beginning</h3>
                      <p className="mt-4 text-sm text-muted-foreground">
                        Through the collaborative efforts of our partner hospital and NGO, 
                        we were able to help a patient transition successfully back into society...
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}