'use client'

import type React from "react"

import { useState } from "react"
// Remplacement des imports Next.js non resolus
// import { useRouter } from "next/navigation"
// import Link from "next/link" 
// L'environnement de compilation ne reconnaît pas les alias, 
// je suppose que_useAuth est disponible globalement ou que ce fichier est au même niveau
// que le dossier 'lib' pour un test simple. 
// Dans un vrai projet Next.js, "@/lib/_auth-context" est correct.
// Pour l'environnement de test, on ne peut pas corriger l'alias, mais on garde le chemin
// en espérant qu'une fois dans le bon environnement, il fonctionne.
import { useAuth } from "@/lib/auth-context"

// Composants UI (assumés _ doivent être définis si non globaux)
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "./ui/alert"

export function LoginForm() {
    const [email, setEmail] = useState("admin@meditrack.com") // Pré-remplissage pour les tests
    const [password, setPassword] = useState("test123") // Pré-remplissage pour les tests
    const [error, setError] = useState("")

    // CORRECTION: Nous extrayons 'authenticate' au lieu de 'login'
    const { authenticate, isLoading } = useAuth()
    // Remplacement de useRouter()
    // const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        console.log("[v2] Tentative de connexion avec:", email)

        try {
            // 1. Appel de la fonction 'authenticate' avec les credentials
            await authenticate({ email, password })

            // Si l'appel réussit, l'AuthProvider gère la redirection,
            // mais en cas de non-fonctionnement, on utilise window.location.href comme _fallback
            console.log("[v2] Connexion réussie.")
            // window.location.href = "/dashboard" // Fallback pour le test si AuthProvider ne redirige pas

        } catch (err) {
            // 2. Si 'authenticate' échoue (lève une erreur API.)
            console.error("[v2] Échec de connexion:", err)
            setError("Email ou mot de passe incorrect. Veuillez vérifier vos informations.")
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
                <CardDescription className="text-center">Accédez à votre espace MediTrack Pro</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="votre.email@exemple.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Connexion..." : "Se connecter"}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Nouveau patient?{" "}
                        {/* Remplacement de Link par <a> */}
                        <a href="/inscription" className="text-primary hover:underline font-medium">
                            Créer un compte
                        </a>
                    </div>

                    <div className="mt-6 p-4 bg-muted rounded-lg">
                        <p className="text-sm font-semibold mb-2">Comptes de test :</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>
                                <strong>Admin:</strong> admin@meditrack.com / test123
                            </p>
                            <p>
                                <strong>Médecin:</strong> dr.diallo@meditrack.com / test123
                            </p>
                            <p>
                                <strong>Patient:</strong> patient@test.com / test123
                            </p>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}