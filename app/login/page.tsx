import { Logo } from "@/components/logo"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/20 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <Logo className="mb-4" />
          <h1 className="text-3xl font-bold text-center text-balance">Système de Gestion Hospitalière</h1>
          <p className="text-muted-foreground text-center text-pretty">
            Gestion complète des patients, rendez-vous et dossiers médicaux
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm text-muted-foreground">
          <p>Projet Pédagogique - Licence 3 Ingénierie Informatique</p>
          <p className="mt-1">UASZ - 2024/2025</p>
        </div>
      </div>
    </div>
  )
}
