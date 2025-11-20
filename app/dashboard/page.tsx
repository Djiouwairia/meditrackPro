// app/dashboard/page.tsx - VERSION AVEC SALUTATION ADAPTÉE À L'HEURE
"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, Activity, Stethoscope, Clock, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { usersApi, rendezVousApi, consultationsApi } from "@/lib/api-client"

interface DashboardStats {
    title: string
    value: string | number
    icon: any
    color: string
    description?: string
}

export default function DashboardPage() {
    const { user } = useAuth()
    const [stats, setStats] = useState<DashboardStats[]>([])
    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // États pour les données réelles
    const [patients, setPatients] = useState<any[]>([])
    const [medecins, setMedecins] = useState<any[]>([])
    const [rendezVous, setRendezVous] = useState<any[]>([])
    const [consultations, setConsultations] = useState<any[]>([])

    // Fonction pour obtenir la salutation en fonction de l'heure
    const getGreeting = (): string => {
        const hour = new Date().getHours()

        if (hour >= 5 && hour < 12) {
            return "Bonjour"
        } else if (hour >= 12 && hour < 18) {
            return "Bon après-midi"
        } else if (hour >= 18 && hour < 22) {
            return "Bonsoir"
        } else {
            return "Bonne nuit"
        }
    }

    // Fonction pour obtenir un message contextuel basé sur l'heure (selon vos préférences)
    const getContextualMessage = (): string => {
        const hour = new Date().getHours()
        const day = new Date().getDay() // 0 = Dimanche, 6 = Samedi
        const isWeekend = day === 0 || day === 6

        if (hour < 6) {
            return "Une nuit productive 💫"
        } else if (hour < 12) {
            if (isWeekend) {
                return "Profitez de votre weekend 🌞"
            }
            return "Belle journée de travail 💼"
        } else if (hour < 18) {
            return "Bon courage pour l'après-midi 🚀"
        } else {
            if (isWeekend) {
                return "Belle soirée de weekend 🌙"
            }
            return "Belle fin de journée 🌆"
        }
    }

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
            setError("Erreur lors du chargement des données")
        } finally {
            setLoading(false)
        }
    }

    const calculateStats = () => {
        if (!user) return

        let userStats: DashboardStats[] = []
        let activity: any[] = []

        switch (user.role) {
            case "ADMIN":
                // Calculs pour l'admin
                const totalPatients = patients.length
                const totalMedecins = medecins.length
                const totalRendezVous = rendezVous.length
                const totalConsultations = consultations.length
                const todayAppointments = rendezVous.filter(rdv => {
                    const today = new Date().toISOString().split("T")[0]
                    const rdvDate = new Date(rdv.dateHeure).toISOString().split("T")[0]
                    return rdvDate === today
                }).length

                userStats = [
                    {
                        title: "Utilisateurs Totaux",
                        value: totalPatients + totalMedecins,
                        icon: Users,
                        color: "text-blue-600",
                        description: `${totalPatients} patients, ${totalMedecins} médecins`
                    },
                    {
                        title: "Médecins Actifs",
                        value: totalMedecins,
                        icon: Stethoscope,
                        color: "text-green-600",
                        description: "Toutes spécialités"
                    },
                    {
                        title: "RDV Cette Semaine",
                        value: totalRendezVous,
                        icon: Calendar,
                        color: "text-purple-600",
                        description: `${todayAppointments} aujourd'hui`
                    },
                    {
                        title: "Consultations",
                        value: totalConsultations,
                        icon: FileText,
                        color: "text-orange-600",
                        description: "Total des consultations"
                    },
                ]

                activity = [
                    { type: "user", message: `${totalMedecins} médecins inscrits`, time: "Mis à jour à l'instant", icon: Users },
                    { type: "appointment", message: `${todayAppointments} RDV aujourd'hui`, time: "Mis à jour à l'instant", icon: Calendar },
                    { type: "consultation", message: `${totalConsultations} consultations enregistrées`, time: "Mis à jour à l'instant", icon: FileText },
                ]
                break

            case "MEDECIN":
                // Calculs pour le médecin
                const medecinId = user.id
                const medecinRendezVous = rendezVous.filter(rdv =>
                    rdv.medecinId === medecinId
                )
                const medecinConsultations = consultations.filter(cons =>
                    cons.medecinId === medecinId
                )
                const mesPatients = [...new Set(medecinConsultations.map(cons => cons.patientId))].length
                const rdvAujourdhui = medecinRendezVous.filter(rdv => {
                    const today = new Date().toISOString().split("T")[0]
                    const rdvDate = new Date(rdv.dateHeure).toISOString().split("T")[0]
                    return rdvDate === today
                }).length
                const rdvEnAttente = medecinRendezVous.filter(rdv =>
                    rdv.statut === "DEMANDE"
                ).length

                userStats = [
                    {
                        title: "Mes Patients",
                        value: mesPatients,
                        icon: Users,
                        color: "text-blue-600",
                        description: "Patients suivis"
                    },
                    {
                        title: "RDV Aujourd'hui",
                        value: rdvAujourdhui,
                        icon: Calendar,
                        color: "text-purple-600",
                        description: "À venir"
                    },
                    {
                        title: "Consultations",
                        value: medecinConsultations.length,
                        icon: FileText,
                        color: "text-green-600",
                        description: "Total effectuées"
                    },
                    {
                        title: "En Attente",
                        value: rdvEnAttente,
                        icon: Clock,
                        color: "text-orange-600",
                        description: "Demandes de RDV"
                    },
                ]

                activity = [
                    { type: "appointment", message: `${rdvEnAttente} demande(s) de RDV en attente`, time: "À traiter", icon: Calendar },
                    { type: "patient", message: `${mesPatients} patients dans votre suivi`, time: "Mis à jour à l'instant", icon: Users },
                    { type: "consultation", message: `${medecinConsultations.length} consultations réalisées`, time: "Historique complet", icon: FileText },
                ]
                break

            case "PATIENT":
                // Calculs pour le patient
                const patientId = user.id
                const patientRendezVous = rendezVous.filter(rdv =>
                    rdv.patientId === patientId
                )
                const patientConsultations = consultations.filter(cons =>
                    cons.patientId === patientId
                )
                const prochainRdv = patientRendezVous
                    .filter(rdv => rdv.statut === "CONFIRME" && new Date(rdv.dateHeure) > new Date())
                    .sort((a, b) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime())[0]

                userStats = [
                    {
                        title: "Prochain RDV",
                        value: prochainRdv ? new Date(prochainRdv.dateHeure).toLocaleDateString('fr-FR') : "Aucun",
                        icon: Calendar,
                        color: "text-purple-600",
                        description: prochainRdv ? `à ${new Date(prochainRdv.dateHeure).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}` : "Prendre rendez-vous"
                    },
                    {
                        title: "Consultations",
                        value: patientConsultations.length,
                        icon: FileText,
                        color: "text-blue-600",
                        description: "Historique médical"
                    },
                    {
                        title: "RDV Total",
                        value: patientRendezVous.length,
                        icon: Clock,
                        color: "text-green-600",
                        description: "Tous vos rendez-vous"
                    },
                    {
                        title: "Dossier Médical",
                        value: "À jour",
                        icon: CheckCircle,
                        color: "text-green-600",
                        description: `Dernière consultation: ${patientConsultations.length > 0 ? new Date(patientConsultations[patientConsultations.length - 1].date).toLocaleDateString('fr-FR') : "Aucune"}`
                    },
                ]

                activity = [
                    { type: "appointment", message: prochainRdv ? "Prochain RDV programmé" : "Aucun RDV à venir", time: prochainRdv ? new Date(prochainRdv.dateHeure).toLocaleDateString('fr-FR') : "Prendre rendez-vous", icon: Calendar },
                    { type: "consultation", message: `${patientConsultations.length} consultation(s) dans votre historique`, time: "Dossier médical", icon: FileText },
                    { type: "reminder", message: "Votre dossier médical est à jour", time: "Dernière mise à jour récente", icon: CheckCircle },
                ]
                break

            default:
                userStats = []
                activity = []
        }

        setStats(userStats)
        setRecentActivity(activity)
    }

    useEffect(() => {
        if (user) {
            fetchRealData()
        }
    }, [user])

    useEffect(() => {
        calculateStats()
    }, [patients, medecins, rendezVous, consultations, user])

    const getWelcomeMessage = () => {
        const contextual = getContextualMessage()

        switch (user?.role) {
            case "ADMIN":
                return `Supervisez l'ensemble de la plateforme MediTrack Pro • ${contextual}`
            case "MEDECIN":
                return `Gérez vos patients et consultations efficacement • ${contextual}`
            case "PATIENT":
                return `Suivez votre santé et vos rendez-vous médicaux • ${contextual}`
            default:
                return `Bienvenue sur MediTrack Pro • ${contextual}`
        }
    }

    const getRoleBadge = () => {
        switch (user?.role) {
            case "ADMIN":
                return "bg-red-100 text-red-700 border-red-200"
            case "MEDECIN":
                return "bg-blue-100 text-blue-700 border-blue-200"
            case "PATIENT":
                return "bg-green-100 text-green-700 border-green-200"
            default:
                return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }

    // Obtenir l'emoji en fonction de l'heure
    const getTimeEmoji = (): string => {
        const hour = new Date().getHours()

        if (hour >= 5 && hour < 12) {
            return "☀️"
        } else if (hour >= 12 && hour < 18) {
            return "🌤️"
        } else if (hour >= 18 && hour < 22) {
            return "🌙"
        } else {
            return "🌜"
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                <span className="text-lg text-muted-foreground">Chargement du tableau de bord...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error}</p>
                    <button
                        onClick={fetchRealData}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-foreground">
                            {getGreeting()}, {user?.prenom} {user?.nom}
                        </h1>
                        <span className="text-2xl">{getTimeEmoji()}</span>
                    </div>
                    <p className="text-muted-foreground text-lg">{getWelcomeMessage()}</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadge()}`}>
                        {user?.role === "ADMIN" && "Administrateur"}
                        {user?.role === "MEDECIN" && "Médecin"}
                        {user?.role === "PATIENT" && "Patient"}
                    </span>
                </div>
            </div>

            {/* Statistiques avec données réelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow duration-200 card-hover">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                <Icon className={`w-5 h-5 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                {stat.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activité récente */}
                <Card>
                    <CardHeader>
                        <CardTitle>Activité Récente</CardTitle>
                        <CardDescription>Vue d'ensemble de votre activité</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => {
                                const Icon = activity.icon
                                return (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <Icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground">
                                                {activity.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Aperçu rapide */}
                <Card>
                    <CardHeader>
                        <CardTitle>Accès Rapide</CardTitle>
                        <CardDescription>Actions principales selon votre profil</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {user?.role === "ADMIN" && (
                                <>
                                    <div className="p-4 bg-accent rounded-lg hover:bg-accent/80 transition-colors cursor-pointer card-hover">
                                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Gestion des Utilisateurs
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Gérer patients, médecins et administrateurs</p>
                                    </div>
                                    <div className="p-4 bg-accent rounded-lg hover:bg-accent/80 transition-colors cursor-pointer card-hover">
                                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                                            <Activity className="w-4 h-4" />
                                            Statistiques Globales
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Analyser l'activité de la plateforme</p>
                                    </div>
                                </>
                            )}
                            {user?.role === "MEDECIN" && (
                                <>
                                    <div className="p-4 bg-accent rounded-lg hover:bg-accent/80 transition-colors cursor-pointer card-hover">
                                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Mes Rendez-vous
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Voir et gérer mon planning</p>
                                    </div>
                                    <div className="p-4 bg-accent rounded-lg hover:bg-accent/80 transition-colors cursor-pointer card-hover">
                                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Mes Patients
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Consulter les dossiers patients</p>
                                    </div>
                                </>
                            )}
                            {user?.role === "PATIENT" && (
                                <>
                                    <div className="p-4 bg-accent rounded-lg hover:bg-accent/80 transition-colors cursor-pointer card-hover">
                                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Prendre Rendez-vous
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Réserver une consultation</p>
                                    </div>
                                    <div className="p-4 bg-accent rounded-lg hover:bg-accent/80 transition-colors cursor-pointer card-hover">
                                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Mon Dossier Médical
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Consulter mon historique médical</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Message de bienvenue détaillé */}
            <Card>
                <CardHeader>
                    <CardTitle>Bienvenue sur MediTrack Pro</CardTitle>
                    <CardDescription>Votre système de gestion hospitalière complet et sécurisé</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            MediTrack Pro vous offre une plateforme moderne pour gérer efficacement tous les aspects
                            {user?.role === "ADMIN" && " de votre établissement médical"}
                            {user?.role === "MEDECIN" && " de votre pratique médicale"}
                            {user?.role === "PATIENT" && " de votre suivi médical"}.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="p-4 bg-accent rounded-lg card-hover">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Gestion des Patients
                                </h3>
                                <p className="text-sm text-muted-foreground">Suivi complet des dossiers médicaux et historiques des patients</p>
                            </div>
                            <div className="p-4 bg-accent rounded-lg card-hover">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Rendez-vous Intelligents
                                </h3>
                                <p className="text-sm text-muted-foreground">Planning optimisé et gestion automatique des créneaux</p>
                            </div>
                            <div className="p-4 bg-accent rounded-lg card-hover">
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Consultations Digitales
                                </h3>
                                <p className="text-sm text-muted-foreground">Saisie sécurisée et traçabilité complète des diagnostics</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}