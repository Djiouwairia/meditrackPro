"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { usersApi, consultationsApi } from "@/lib/api-client"
import { ConsultationForm } from "@/components/consultation-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NouvelleConsultationPage() {
    const router = useRouter()
    const { user } = useAuth()
    const { toast } = useToast()
    const [patients, setPatients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadPatients = async () => {
            try {
                const patientsData = await usersApi.getPatients()
                setPatients(patientsData)
            } catch (error) {
                console.error("Erreur chargement patients:", error)
                toast({
                    title: "Erreur",
                    description: "Impossible de charger la liste des patients",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        loadPatients()
    }, [toast])

    const handleSave = async (data: any) => {
        try {
            // CORRECTION : Vérification que userid existe
            if (!user?.id) {
                toast({
                    title: "Erreur",
                    description: "Utilisateur non connecté",
                    variant: "destructive",
                })
                return
            }

            // CORRECTION : Vérification que patientId est défini
            const patientId = data.patientId || patients[0]?.id
            if (!patientId) {
                toast({
                    title: "Erreur",
                    description: "Aucun patient sélectionné",
                    variant: "destructive",
                })
                return
            }

            const consultationData = {
                patientId: patientId,
                medecinId: user.id, // Maintenant garanti d'être un number
                date: new Date().toISOString().split('T')[0],
                motif: data.motif,
                examenClinique: data.examenClinique,
                diagnostic: data.diagnostic,
                notesPrivees: data.notesPrivees
            }

            await consultationsApi.create(consultationData)
            toast({
                title: "Consultation enregistrée",
                description: "La consultation a été enregistrée avec succès.",
            })
            router.push("/dashboard/consultations")
        } catch (error) {
            console.error("Erreur création consultation:", error)
            toast({
                title: "Erreur",
                description: "Impossible de créer la consultation",
                variant: "destructive",
            })
        }
    }

    const handleCancel = () => {
        router.push("/dashboard/consultations")
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                <span>Chargement des patients...</span>
            </div>
        )
    }

    if (!patients.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Aucun patient trouvé</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Nouvelle Consultation</h1>
                    <p className="text-muted-foreground">Enregistrez les détails de la consultation</p>
                </div>
            </div>

            <ConsultationForm
                patients={patients}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </div>
    )
}