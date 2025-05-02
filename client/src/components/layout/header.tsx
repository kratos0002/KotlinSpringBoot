import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCity } from "@/hooks/use-city.tsx";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cities = [
  { id: "Amsterdam", name: "Amsterdam" },
  { id: "Dublin", name: "Dublin" },
  { id: "Calgary", name: "Calgary" },
];

export default function Header() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { city, updateCity } = useCity();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const publicNavItems = [
    { href: "/", label: "Home" },
    { href: "/info", label: "Info Hub" },
  ];

  const privateNavItems = [
    { href: "/pets", label: "My Pets" },
    { href: "/services", label: "Services" },
  ];

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <img src="/1.png" alt="PawConnect Logo" className="h-48 w-48" />
              <span className="text-4xl font-bold">PawConnect</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <nav className="flex flex-col space-y-4 py-4">
              {publicNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className="text-gray-600 hover:text-gray-900">
                    {item.label}
                  </span>
                </Link>
              ))}
              {user && privateNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className="text-gray-600 hover:text-gray-900">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
