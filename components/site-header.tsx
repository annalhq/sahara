"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MenuIcon,
  XIcon,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  HeartHandshake,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion"; 

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { session, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getUserInitials = () => {
    if (!session?.user?.user_metadata?.name) return "U";
    return session.user.user_metadata.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getOrganizationType = () => {
    if (!session?.user?.user_metadata?.organization_type) return "User";
    return session.user.user_metadata.organization_type === "hospital"
      ? "Hospital"
      : "NGO";
  };

  // Animation Variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.25, ease: "easeInOut" },
    },
  };

  const mobileMenuItemsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const mobileMenuItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: "easeOut", duration: 0.2 },
    },
  };

  const themeIconVariants = {
    initial: { opacity: 0, rotate: -90, scale: 0.5 },
    animate: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.25 },
    },
    exit: { opacity: 0, rotate: 90, scale: 0.5, transition: { duration: 0.2 } },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Brand Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link
            href="/"
            className="flex items-center space-x-2 transition-colors hover:text-primary mr-6"
            onClick={() => setMobileMenuOpen(false)}
          >
            <HeartHandshake className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">Sahara</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation & Auth */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-4">
          {/* Nav Links (Optional - Add if needed) */}
          {/* <nav className="flex gap-4">
            <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">About</Link>
            <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">How it Works</Link>
          </nav> */}

          {!loading && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <AnimatePresence>
                <DropdownMenuContent
                  asChild 
                  forceMount 
                >
                  <motion.div
                    className="w-56"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session?.user?.user_metadata?.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session?.user?.email}
                        </p>
                        <p className="text-xs font-semibold text-primary/90 mt-1">
                          {getOrganizationType()}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          session?.user?.user_metadata?.organization_type ===
                          "hospital"
                            ? "/hospital"
                            : "/ngo"
                        }
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        await fetch("/api/auth/signout", { method: "POST" });
                        window.location.href = "/";
                      }}
                      className="cursor-pointer text-red-600 dark:text-red-500 focus:bg-red-100 dark:focus:bg-red-900/50 focus:text-red-700 dark:focus:text-red-400"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </motion.div>
                </DropdownMenuContent>
              </AnimatePresence>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <Link href="/auth/login">Login</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="sm" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </motion.div>
            </div>
          )}

          {/* Theme Toggle */}
          {mounted && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="h-9 w-9 rounded-full"
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={theme === "dark" ? "moon" : "sun"}
                    variants={themeIconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          {/* Theme toggle for mobile - outside menu button */}
          {mounted && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mr-2"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="h-9 w-9 rounded-full"
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={theme === "dark" ? "moon-mobile" : "sun-mobile"}
                    variants={themeIconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </motion.div>
          )}

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={mobileMenuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <XIcon className="h-5 w-5" />
                  ) : (
                    <MenuIcon className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 w-full bg-background/95 border-b border-border/40 shadow-lg overflow-hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.nav
              className="flex flex-col space-y-2 p-4"
              variants={mobileMenuItemsContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {!loading && isAuthenticated ? (
                <>
                  <motion.div
                    variants={mobileMenuItemVariants}
                    className="flex items-center gap-3 px-2 py-1.5 mb-2 border-b pb-3"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {session?.user?.user_metadata?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getOrganizationType()}
                      </p>
                    </div>
                  </motion.div>
                  <motion.div variants={mobileMenuItemVariants}>
                    <Link
                      href={
                        session?.user?.user_metadata?.organization_type ===
                        "hospital"
                          ? "/hospital"
                          : "/ngo"
                      }
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.div variants={mobileMenuItemVariants}>
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </motion.div>
                  <motion.div variants={mobileMenuItemVariants}>
                    <button
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      onClick={async () => {
                        await fetch("/api/auth/signout", { method: "POST" });
                        window.location.href = "/";
                        setMobileMenuOpen(false);
                      }}
                    >
                      Log out
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={mobileMenuItemVariants}>
                    <Link
                      href="/auth/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div variants={mobileMenuItemVariants}>
                    <Link
                      href="/auth/register"
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              )}
              {/* Separator only if logged in */}
              {!loading && isAuthenticated && (
                <DropdownMenuSeparator className="my-2" />
              )}

              {/* Mobile Nav Links (Optional) */}
              {/* <motion.div variants={mobileMenuItemVariants}>
                   <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>About</Link>
                </motion.div>
                 <motion.div variants={mobileMenuItemVariants}>
                   <Link href="/how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>How it Works</Link>
                 </motion.div> */}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
