"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { consultationsApi, Consultation } from "@/lib/api-client"
import { usersApi, Patient, Medecin } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, User, Calendar, Pill, Search, Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

// 🔥 SUPPRIMEZ cette fonction Label et utilisez plutôt le composant Label de shadcn/ui
// function Label({ children, className }: { children: React.ReactNode; className?: string }) {
//     return <label className={`text-xs text-muted-foreground font-semibold ${className}`}>{children}</label>
// }

export default function ConsultationsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [consultations, setConsultations] = useState<Consultation[]>([])
    const [patients, setPatients] = useState<Patient[]>([])
    const [medecins, setMedecins] = useState<Medecin[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")




    // Charger les consultations
    const loadConsultations = async () => {
        if (!user) return

        try {
            setLoading(true)
            let data: Consultation[] = []

            if (user.role === "ADMIN") {
                data = await consultationsApi.getAll()
            } else if (user.role === "MEDECIN") {
                data = await consultationsApi.getByMedecin(user.id)
            } else if (user.role === "PATIENT") {
                data = await consultationsApi.getByPatient(user.id)
            }

            setConsultations(data)
        } catch (error) {
            console.error("Erreur chargement consultations:", error)
        } finally {
            setLoading(false)
        }
    }

    // Charger patients et médecins
    const loadUsers = async () => {
        try {
            const [patientsData, medecinsData] = await Promise.all([
                usersApi.getPatients(),
                usersApi.getMedecins()
            ])
            setPatients(patientsData)
            setMedecins(medecinsData)
        } catch (error) {
            console.error("Erreur chargement utilisateurs:", error)
        }
    }

    useEffect(() => {
        if (user) {
            loadConsultations()
            if (user.role === "ADMIN") {
                loadUsers()
            } else if (user.role === "MEDECIN") {
                // Pour les médecins, on charge seulement les patients
                usersApi.getPatients().then(setPatients).catch(console.error)
            }
        }
    }, [user])

    const filteredConsultations = consultations.filter((consultation) => {
        const patient = patients.find(p => p.id === consultation.patientId)
        const searchLower = searchTerm.toLowerCase()

        return (
            searchTerm === "" ||
            patient?.nom.toLowerCase().includes(searchLower) ||
            patient?.prenom.toLowerCase().includes(searchLower) ||
            consultation.diagnostic?.toLowerCase().includes(searchLower) ||
            consultation.motif.toLowerCase().includes(searchLower)
        )
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date)
    }

    const getPatientInfo = (patientId: number) => {
        return patients.find(p => p.id === patientId)
    }

    const getMedecinInfo = (medecinId: number) => {
        return medecins.find(m => m.id === medecinId)
    }

    // 🔥 AJOUTEZ cette fonction helper pour remplacer la fonction Label supprimée
    const ConsultationLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => {
        return <label className={`text-xs text-muted-foreground font-semibold ${className}`}>{children}</label>
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                <span className="text-lg text-muted-foreground">Chargement des consultations...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        {user?.role === "ADMIN" ? "Toutes les Consultations" : "Mes Consultations"}
                    </h1>
                    <p className="text-muted-foreground">
                        {user?.role === "ADMIN"
                            ? "Gérez toutes les consultations de l'établissement"
                            : "Consultez et gérez vos consultations"}
                    </p>
                </div>
                {(user?.role === "ADMIN" || user?.role === "MEDECIN") && (
                    <Button className="gap-2" onClick={() => router.push("/dashboard/consultations/nouvelle")}>
                        <Plus className="w-4 h-4" />
                        Nouvelle consultation
                    </Button>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{consultations.length}</p>
                                <p className="text-sm text-muted-foreground">Total Consultations</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <User className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {new Set(consultations.map(c => c.patientId)).size}
                                </p>
                                <p className="text-sm text-muted-foreground">Patients Uniques</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {consultations.filter(c => new Date(c.date).toDateString() === new Date().toDateString()).length}
                                </p>
                                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par patient, diagnostic ou motif..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Consultations List */}
            <div className="space-y-4">
                {filteredConsultations.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    {searchTerm ? "Aucune consultation trouvée" : "Aucune consultation"}
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    {searchTerm ? "Essayez de modifier vos critères de recherche" : "Vos consultations apparaîtront ici"}
                                </p>
                                {searchTerm && (
                                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                                        Réinitialiser la recherche
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    filteredConsultations.map((consultation) => {
                        const patient = getPatientInfo(consultation.patientId)
                        const medecin = getMedecinInfo(consultation.medecinId)

                        return (
                            <Card
                                key={consultation.id}
                                className="hover:shadow-lg transition-shadow border-l-4 border-l-primary cursor-pointer"
                                onClick={() => router.push(`/dashboard/consultations/${consultation.id}`)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle>
                                                    {patient ? `${patient.prenom} ${patient.nom}` : `Patient #${consultation.patientId}`}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(consultation.date)}
                                                    {medecin && ` - Dr. ${medecin.prenom} ${medecin.nom}`}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">#{consultation.id}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div>
                                                {/* 🔥 REMPLACEZ Label par ConsultationLabel */}
                                                <ConsultationLabel className="font-semibold text-sm">Motif de consultation</ConsultationLabel>
                                                <p className="text-sm text-muted-foreground mt-1">{consultation.motif}</p>
                                            </div>

                                            {consultation.examenClinique && (
                                                <div>
                                                    <ConsultationLabel className="font-semibold text-sm">Examen clinique</ConsultationLabel>
                                                    <p className="text-sm text-muted-foreground mt-1">{consultation.examenClinique}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {consultation.diagnostic && (
                                                <div>
                                                    <ConsultationLabel className="font-semibold text-sm">Diagnostic</ConsultationLabel>
                                                    <p className="text-sm font-medium text-foreground mt-1 p-2 bg-accent rounded">
                                                        {consultation.diagnostic}
                                                    </p>
                                                </div>
                                            )}

                                            {consultation.notesPrivees && (
                                                <div>
                                                    <ConsultationLabel className="font-semibold text-sm">Notes privées</ConsultationLabel>
                                                    <p className="text-sm text-muted-foreground mt-1">{consultation.notesPrivees}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-border">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.push(`/dashboard/consultations/${consultation.id}`)
                                            }}
                                        >
                                            Voir les détails
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (patient) {
                                                    router.push(`/dashboard/patients/${patient.id}`)
                                                }
                                            }}
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            Dossier patient
                                        </Button>
                                        {(user?.role === "ADMIN" || user?.role === "MEDECIN") && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="ml-auto bg-transparent"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    // Naviguer vers la page d'édition
                                                    router.push(`/dashboard/consultations/${consultation.id}/edit`)
                                                }}
                                            >
                                                Modifier
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}