"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Building2,
  HeartHandshake,
  Users,
  Heart,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      const sections = ["home", "impact", "features", "testimonials", "cta"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
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

  const features = [
    {
      title: "Seamless Collaboration",
      description:
        "Connect hospitals and NGOs with real-time tracking and communication tools",
      icon: "🔄",
    },
    {
      title: "Patient-Centered Care",
      description:
        "Comprehensive rehabilitation pathways designed for individual needs",
      icon: "❤️",
    },
    {
      title: "Impact Reporting",
      description:
        "Detailed analytics and outcomes monitoring for continuous improvement",
      icon: "📊",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/90">
      <main className="flex-grow">
        {/* Hero Section */}
        <section id="home" className="relative isolate overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 -z-10">
            <motion.div
              className="absolute right-[10%] top-[15%] h-72 w-72 rounded-full bg-primary/10 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute left-[5%] bottom-[10%] h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.2, 0.4],
              }}
              transition={{
                repeat: Infinity,
                duration: 10,
                delay: 1,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="space-y-8 max-w-3xl mx-auto text-center"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={container}
            >
              <motion.div
                className="inline-flex items-center rounded-full px-4 py-1 text-sm bg-primary/10 text-primary"
                variants={item}
              >
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
                Making healthcare accessible for all
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                variants={item}
              >
                <span className="text-foreground">Bridging </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-violet-500 to-purple-600">
                  Healthcare & Hope
                </span>
              </motion.h1>

              <motion.p
                className="text-lg text-foreground/70 max-w-xl mx-auto leading-relaxed"
                variants={item}
              >
                We connect hospitals with NGOs to ensure successful
                rehabilitation and reintegration of leprosy patients into
                society, creating pathways to healing and renewed dignity.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={item}
              >
                <Button
                  size="lg"
                  className="relative overflow-hidden group px-6 py-6 text-lg bg-gradient-to-r from-primary to-violet-600 hover:from-primary hover:to-violet-700"
                >
                  <span className="relative flex items-center gap-2 z-10">
                    Hospital Portal
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        repeatType: "reverse",
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 py-6 text-lg group border-primary/20 hover:border-primary/40"
                >
                  <span className="flex items-center gap-2">
                    NGO Portal
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        repeatType: "reverse",
                        delay: 0.2,
                      }}
                    >
                      <ArrowRight className="h-4 w-4 text-primary group-hover:text-primary" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>

              <motion.div
                className="pt-4 flex items-center justify-center gap-6"
                variants={item}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-background flex items-center justify-center text-xs font-medium"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">
                    250+ organizations
                  </span>{" "}
                  trust our platform
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="impact" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-foreground/70">
                Through powerful collaborations between healthcare providers and
                NGOs, we&apos;re making a measurable difference in
                patients%apos; lives.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="p-8 h-full border-none shadow-lg bg-gradient-to-b from-background to-foreground/5 hover:shadow-xl transition-all duration-300">
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className="h-8 w-8 text-primary" />
                    </motion.div>

                    <motion.p
                      className="text-4xl font-bold text-foreground mb-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        delay: 0.1 + index * 0.2,
                      }}
                    >
                      {stat.value}
                    </motion.p>

                    <h3 className="text-lg font-medium mb-3 text-foreground">
                      {stat.label}
                    </h3>

                    <p className="text-foreground/60 leading-relaxed">
                      {stat.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-foreground/70">
                Our platform simplifies collaboration between hospitals and NGOs
                with powerful yet intuitive tools.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-8 rounded-2xl bg-gradient-to-br from-background to-foreground/5 border border-foreground/10 hover:border-primary/20 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="text-4xl mb-4"
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70">{feature.description}</p>

                  <motion.div
                    className="mt-6 flex items-center text-primary text-sm font-medium cursor-pointer group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="cta" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-y-0 right-1/2 -ml-72 w-[36.125rem] rounded-r-3xl bg-gradient-to-r from-primary/10 to-violet-500/10 blur-2xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to make a <span className="text-primary">difference</span>
                ?
              </h2>
              <p className="text-lg text-foreground/70 mb-10 max-w-xl mx-auto">
                Join our network of healthcare providers and NGOs working
                together to transform lives and reshape patient aftercare.
              </p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg bg-gradient-to-r from-primary to-violet-600 hover:from-primary hover:to-violet-700 group"
                >
                  <span className="flex items-center gap-2">
                    Get Started
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        repeatType: "reverse",
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg border-primary/20 hover:border-primary/40"
                >
                  Contact Us
                </Button>
              </motion.div>

              <div className="mt-10 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {["HIPAA Compliant", "24/7 Support", "Free Onboarding"].map(
                  (feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <CheckCircle className="h-4 w-4 text-primary mr-1" />
                      {feature}
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-foreground/10 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
              <HeartHandshake className="h-6 w-6 fill-primary stroke-background" />
              <span>Sahara</span>
            </div>
            <p className="text-sm text-foreground/70 max-w-xs">
              A Community engagement project by Team Sahara
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
