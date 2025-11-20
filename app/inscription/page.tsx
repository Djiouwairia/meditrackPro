"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Logo } from "@/components/logo"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from '@/lib/api-client'

type UserRole = 'PATIENT' | 'MEDECIN' | 'ADMIN';

export default function InscriptionPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [userRole, setUserRole] = useState<UserRole>("PATIENT")

    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        confirmPassword: "",
        telephone: "",
        dateNaissance: "",
        numeroSecuriteSociale: "",
        adresse: "",
        groupeSanguin: "",
        // Champs spécifiques Medecin
        specialite: "",
        numeroIdentification: "",
        adresseCabinet: "",
        tarifConsultation: "",
        // Champs spécifiques Admin
        departement: "",
    })

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas")
            return
        }

        if (formData.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères")
            return
        }

        // Validation des champs obligatoires selon le rôle
        if (userRole === 'MEDECIN') {
            if (!formData.specialite || !formData.numeroIdentification || !formData.adresseCabinet) {
                setError("Tous les champs obligatoires pour le médecin doivent être remplis")
                return
            }
        }

        if (userRole === 'ADMIN' && !formData.departement) {
            setError("Le département est obligatoire pour un administrateur")
            return
        }

        setIsLoading(true)

        try {
            // Préparer les données pour l'API
            const userData = {
                email: formData.email,
                password: formData.password,
                nom: formData.nom,
                prenom: formData.prenom,
                telephone: formData.telephone,
                role: userRole,
                // Champs spécifiques selon le rôle
                ...(userRole === 'PATIENT' && {
                    dateNaissance: formData.dateNaissance,
                    numeroSecuriteSociale: formData.numeroSecuriteSociale,
                    adresse: formData.adresse,
                    groupeSanguin: formData.groupeSanguin,
                }),
                ...(userRole === 'MEDECIN' && {
                    specialite: formData.specialite,
                    numeroIdentification: formData.numeroIdentification,
                    adresseCabinet: formData.adresseCabinet,
                    tarifConsultation: formData.tarifConsultation ? parseFloat(formData.tarifConsultation) : undefined,
                }),
                ...(userRole === 'ADMIN' && {
                    departement: formData.departement,
                }),
            }

            console.log("🔄 Inscription:", userData)

            // Appel API pour créer l'utilisateur
            const response = await apiClient.post("/admin/users", userData)

            console.log("✅ Utilisateur créé avec succès:", response)
            setSuccess(true)

            // Redirection après 2 secondes
            setTimeout(() => {
                router.push("/login")
            }, 2000)

        } catch (err: any) {
            console.error("❌ Erreur lors de l'inscription:", err)
            setError(err.message || "Erreur lors de l'inscription")
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-50 to-medical-100 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-success" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Inscription réussie!</CardTitle>
                        <CardDescription>
                            Votre compte {userRole === 'PATIENT' ? 'patient' : userRole === 'MEDECIN' ? 'médecin' : 'administrateur'} a été créé avec succès. Redirection vers la page de connexion...
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            <div className="w-full max-w-2xl">
                <div className="flex justify-center mb-6">
                    <Logo />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Inscription</CardTitle>
                        <CardDescription className="text-center">Créez votre compte pour accéder à MediTrack Pro</CardDescription>
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
                                <Label htmlFor="role">Type de compte *</Label>
                                <Select value={userRole} onValueChange={(value: UserRole) => setUserRole(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez le type de compte" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PATIENT">Patient</SelectItem>
                                        <SelectItem value="MEDECIN">Médecin</SelectItem>
                                        <SelectItem value="ADMIN">Administrateur</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nom">Nom *</Label>
                                    <Input
                                        id="nom"
                                        placeholder="Votre nom"
                                        value={formData.nom}
                                        onChange={(e) => handleChange("nom", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="prenom">Prénom *</Label>
                                    <Input
                                        id="prenom"
                                        placeholder="Votre prénom"
                                        value={formData.prenom}
                                        onChange={(e) => handleChange("prenom", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votre.email@exemple.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mot de passe *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirmer mot de passe *</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telephone">Téléphone *</Label>
                                <Input
                                    id="telephone"
                                    type="tel"
                                    placeholder="+221 77 123 4567"
                                    value={formData.telephone}
                                    onChange={(e) => handleChange("telephone", e.target.value)}
                                    required
                                />
                            </div>

                            {/* Champs spécifiques pour les patients */}
                            {userRole === 'PATIENT' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="dateNaissance">Date de naissance *</Label>
                                        <Input
                                            id="dateNaissance"
                                            type="date"
                                            value={formData.dateNaissance}
                                            onChange={(e) => handleChange("dateNaissance", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="numeroSecuriteSociale">Numéro de Sécurité Sociale</Label>
                                        <Input
                                            id="numeroSecuriteSociale"
                                            placeholder="190050012345"
                                            value={formData.numeroSecuriteSociale}
                                            onChange={(e) => handleChange("numeroSecuriteSociale", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="adresse">Adresse</Label>
                                        <Input
                                            id="adresse"
                                            placeholder="Votre adresse complète"
                                            value={formData.adresse}
                                            onChange={(e) => handleChange("adresse", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="groupeSanguin">Groupe sanguin</Label>
                                        <Select value={formData.groupeSanguin} onValueChange={(value) => handleChange("groupeSanguin", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez votre groupe sanguin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="A+">A+</SelectItem>
                                                <SelectItem value="A-">A-</SelectItem>
                                                <SelectItem value="B+">B+</SelectItem>
                                                <SelectItem value="B-">B-</SelectItem>
                                                <SelectItem value="AB+">AB+</SelectItem>
                                                <SelectItem value="AB-">AB-</SelectItem>
                                                <SelectItem value="O+">O+</SelectItem>
                                                <SelectItem value="O-">O-</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}

                            {/* Champs spécifiques pour les médecins */}
                            {userRole === 'MEDECIN' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="specialite">Spécialité *</Label>
                                        <Input
                                            id="specialite"
                                            placeholder="Votre spécialité médicale"
                                            value={formData.specialite}
                                            onChange={(e) => handleChange("specialite", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="numeroIdentification">Numéro d'identification *</Label>
                                        <Input
                                            id="numeroIdentification"
                                            placeholder="Votre numéro d'identification professionnelle"
                                            value={formData.numeroIdentification}
                                            onChange={(e) => handleChange("numeroIdentification", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="adresseCabinet">Adresse du cabinet *</Label>
                                        <Input
                                            id="adresseCabinet"
                                            placeholder="Adresse complète de votre cabinet"
                                            value={formData.adresseCabinet}
                                            onChange={(e) => handleChange("adresseCabinet", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tarifConsultation">Tarif consultation (FCFA)</Label>
                                        <Input
                                            id="tarifConsultation"
                                            type="number"
                                            placeholder="15000"
                                            value={formData.tarifConsultation}
                                            onChange={(e) => handleChange("tarifConsultation", e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Champs spécifiques pour les administrateurs */}
                            {userRole === 'ADMIN' && (
                                <div className="space-y-2">
                                    <Label htmlFor="departement">Département *</Label>
                                    <Input
                                        id="departement"
                                        placeholder="Votre département d'administration"
                                        value={formData.departement}
                                        onChange={(e) => handleChange("departement", e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Inscription en cours..." : "S'inscrire"}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                Vous avez déjà un compte?{" "}
                                <Link href="/login" className="text-primary hover:underline font-medium">
                                    Se connecter
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}