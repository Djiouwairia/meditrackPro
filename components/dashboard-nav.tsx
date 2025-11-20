"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Logo } from "./logo"
import { Button } from "./ui/button"
import {
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  LayoutDashboard,
  Stethoscope,
  UserCircle,
  ClipboardList,
  Clock,
} from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getNavItems = () => {
    switch (user?.role) {
      case "ADMIN":
        return [
          { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
          { href: "/dashboard/utilisateurs", label: "Utilisateurs", icon: Users },
          { href: "/dashboard/statistiques", label: "Statistiques", icon: FileText },
          { href: "/dashboard/rendez-vous", label: "Rendez-vous", icon: Calendar },
          { href: "/dashboard/parametres", label: "Paramètres", icon: Settings },
        ]
      case "MEDECIN":
        return [
          { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
          { href: "/dashboard/mes-patients", label: "Mes Patients", icon: Users },
          { href: "/dashboard/rendez-vous", label: "Rendez-vous", icon: Calendar },
          { href: "/dashboard/consultations", label: "Consultations", icon: ClipboardList },
          { href: "/dashboard/disponibilites", label: "Disponibilités", icon: Clock },
          { href: "/dashboard/profil", label: "Mon Profil", icon: UserCircle },
        ]
      case "PATIENT":
        return [
          { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
          { href: "/dashboard/mes-rendez-vous", label: "Mes Rendez-vous", icon: Calendar },
          { href: "/dashboard/dossier-medical", label: "Dossier Médical", icon: FileText },
          { href: "/dashboard/medecins", label: "Trouver un Médecin", icon: Stethoscope },
          { href: "/dashboard/profil", label: "Mon Profil", icon: UserCircle },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Logo />
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <div className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="p-6 border-t border-border">
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm font-semibold text-foreground">
            {user?.prenom} {user?.nom}
          </p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-primary mt-1 font-medium">
            {user?.role === "ADMIN" && "Administrateur"}
            {user?.role === "MEDECIN" && "Médecin"}
            {user?.role === "PATIENT" && "Patient"}
          </p>
        </div>
        <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </nav>
  )
}
