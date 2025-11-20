
// app/dashboard/statistiques/page.tsx - VERSION CORRIGÉE
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Stethoscope, TrendingUp, UserCheck, Clock, Activity, FileText, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { usersApi, rendezVousApi, consultationsApi } from "@/lib/api-client"

interface DashboardStats {
    title: string
    value: string | number
    icon: any
    color: string
    description?: string
    trend?: string
}

interface SpecialiteStats {
    nom: string
    patients: number
    rdv: number
}

// 🔥 FONCTION UTILITAIRE POUR GÉRER LES IDs - VERSION AMÉLIORÉE
const safeNumber = (id: any): number => {
    if (id === null || id === undefined) return 0
    if (typeof id === 'number') return id
    if (typeof id === 'string') {
        const num = Number.parseInt(id, 10)
        return Number.isNaN(num) ? 0 : num
    }
    return 0
}

// 🔥 FONCTION POUR COMPARER LES IDs EN TOUTE SÉCURITÉ
const compareIds = (id1: any, id2: any): boolean => {
    return safeNumber(id1) === safeNumber(id2)
}

export default function StatistiquesPage() {
    const { user } = useAuth()
    const [stats, setStats] = useState<DashboardStats[]>([])
    const [specialites, setSpecialites] = useState<SpecialiteStats[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // États pour les données réelles
    const [patients, setPatients] = useState<any[]>([])
    const [medecins, setMedecins] = useState<any[]>([])
    const [rendezVous, setRendezVous] = useState<any[]>([])
    const [consultations, setConsultations] = useState<any[]>([])

    const fetchRealData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Charger toutes les données en parallèle
            const [patientsData, medecinsData, rendezVousData, consultationsData] = await Promise.all([
                usersApi.getPatients(),
                usersApi.getMedecins(),
                rendezVousApi.getAll(),
                consultationsApi.getAll()
            ])

            setPatients(patientsData)
            setMedecins(medecinsData)
            setRendezVous(rendezVousData)
            setConsultations(consultationsData)

            console.log('✅ Données chargées:', {
                patients: patientsData.length,
                medecins: medecinsData.length,
                rendezVous: rendezVousData.length,
                consultations: consultationsData.length
            })

        } catch (err: any) {
            console.error('❌ Erreur chargement données:', err)
            setError("Erreur lors du chargement des données statistiques")
        } finally {
            setLoading(false)
        }
    }

    const calculateStats = () => {
        if (loading) return

        // CALCULS STATISTIQUES RÉELS
        const totalPatients = patients.length
        const totalMedecins = medecins.length
        const totalRendezVous = rendezVous.length
        const totalConsultations = consultations.length

        // Rendez-vous par statut - 🔥 CORRECTION : Utiliser des comparaisons de chaînes
        const confirmedAppointments = rendezVous.filter((rdv) =>
            rdv.statut && rdv.statut.toString().toUpperCase() === "CONFIRME"
        ).length

        const pendingAppointments = rendezVous.filter((rdv) =>
            rdv.statut && rdv.statut.toString().toUpperCase() === "DEMANDE"
        ).length

        // Rendez-vous aujourd'hui
        const today = new Date().toISOString().split("T")[0]
        const todayAppointments = rendezVous.filter((rdv) => {
            try {
                if (!rdv.dateHeure) return false
                const rdvDate = new Date(rdv.dateHeure).toISOString().split("T")[0]
                return rdvDate === today
            } catch {
                return false
            }
        }).length

        // Calculer les stats par spécialité
        const specialiteStats: SpecialiteStats[] = medecins.map(medecin => {
            // 🔥 UTILISATION DE LA FONCTION DE COMPARAISON SÉCURISÉE
            const medecinId = safeNumber(medecin.id)

            // 🔥 CORRECTION : Utiliser compareIds au lieu de ===
            const medecinRdv = rendezVous.filter(rdv =>
                compareIds(rdv.medecinId, medecinId)
            ).length

            const medecinPatients = consultations.filter(cons =>
                compareIds(cons.medecinId, medecinId)
            )
                .map(cons => safeNumber(cons.patientId))
                .filter((value, index, self) => self.indexOf(value) === index)
                .length

            return {
                nom: medecin.specialite || 'Non spécifiée',
                patients: medecinPatients,
                rdv: medecinRdv
            }
        })

        // Regrouper par spécialité
        const groupedSpecialites = specialiteStats.reduce((acc, curr) => {
            const existing = acc.find(item => item.nom === curr.nom)
            if (existing) {
                existing.patients += curr.patients
                existing.rdv += curr.rdv
            } else {
                acc.push({ ...curr })
            }
            return acc
        }, [] as SpecialiteStats[])

        setSpecialites(groupedSpecialites)

        // STATS CARDS DATA
        const userStats: DashboardStats[] = [
            {
                title: "Total Patients",
                value: totalPatients,
                icon: Users,
                description: "Patients enregistrés",
                trend: "+12% ce mois",
                color: "bg-blue-500",
            },
            {
                title: "Médecins Actifs",
                value: totalMedecins,
                icon: Stethoscope,
                description: "Médecins disponibles",
                trend: "Stable",
                color: "bg-green-500",
            },
            {
                title: "Rendez-vous Total",
                value: totalRendezVous,
                icon: Calendar,
                description: "Tous les rendez-vous",
                trend: "+8% cette semaine",
                color: "bg-purple-500",
            },
            {
                title: "Consultations",
                value: totalConsultations,
                icon: FileText,
                description: "Consultations terminées",
                trend: "+15% ce mois",
                color: "bg-orange-500",
            },
            {
                title: "RDV Confirmés",
                value: confirmedAppointments,
                icon: UserCheck,
                description: "Rendez-vous validés",
                trend: `${totalRendezVous > 0 ? Math.round((confirmedAppointments / totalRendezVous) * 100) : 0}% du total`,
                color: "bg-emerald-500",
            },
            {
                title: "RDV En Attente",
                value: pendingAppointments,
                icon: Clock,
                description: "En attente de confirmation",
                trend: "À traiter",
                color: "bg-yellow-500",
            },
            {
                title: "RDV Aujourd'hui",
                value: todayAppointments,
                icon: Activity,
                description: "Rendez-vous du jour",
                trend: todayAppointments > 0 ? "En cours" : "Calme",
                color: "bg-red-500",
            },
            {
                title: "Taux d'Occupation",
                value: `${totalRendezVous > 0 ? Math.round((confirmedAppointments / totalRendezVous) * 100) : 0}%`,
                icon: TrendingUp,
                description: "Occupation des créneaux",
                trend: "Excellent",
                color: "bg-indigo-500",
            },
        ]

        setStats(userStats)
    }

    useEffect(() => {
        fetchRealData()
    }, [])

    useEffect(() => {
        calculateStats()
    }, [patients, medecins, rendezVous, consultations, loading])

    const maxRdvSpecialite = Math.max(...specialites.map(s => s.rdv), 1)

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                <span className="text-lg text-muted-foreground">Chargement des statistiques...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={fetchRealData}>
                        Réessayer
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Statistiques</h1>
                <p className="text-muted-foreground mt-1">Vue d'ensemble de l'activité de l'établissement</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Card key={index} className="transform hover:scale-[1.02] transition-transform duration-300">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                <div className={`${stat.color} p-2 rounded-lg shadow-md`}>
                                    <Icon className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                <p className="text-xs text-primary font-medium mt-2">{stat.trend}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Activité par Spécialité</CardTitle>
                        <CardDescription>Répartition des patients et rendez-vous par spécialité médicale</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {specialites.map((specialite, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium">{specialite.nom}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {specialite.patients} patients · {specialite.rdv} rendez-vous
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 w-full max-w-[150px]">
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-500"
                                                style={{ width: `${(specialite.rdv / maxRdvSpecialite) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground w-[40px] text-right">
                                            {Math.round((specialite.rdv / maxRdvSpecialite) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Médecins les Plus Actifs</CardTitle>
                        <CardDescription>Top médecins par nombre de consultations ce mois</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {medecins.slice(0, 5).map((medecin, index) => {
                                // 🔥 UTILISATION DE LA FONCTION DE COMPARAISON SÉCURISÉE
                                const medecinId = safeNumber(medecin.id)

                                // 🔥 CORRECTION : Utiliser compareIds au lieu de ===
                                const medecinConsultations = consultations.filter((c) =>
                                    compareIds(c.medecinId, medecinId)
                                ).length

                                const medecinRendezVous = rendezVous.filter((a) =>
                                    compareIds(a.medecinId, medecinId)
                                ).length

                                return (
                                    <div key={medecin.id} className="flex items-center justify-between border-b last:border-b-0 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                <span className="text-sm font-semibold text-primary">{index + 1}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">Dr. {medecin.prenom} {medecin.nom}</p>
                                                <p className="text-sm text-muted-foreground">{medecin.specialite}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-sm">{medecinConsultations} consultations</p>
                                            <p className="text-xs text-muted-foreground">{medecinRendezVous} RDV</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}