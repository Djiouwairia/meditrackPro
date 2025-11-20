"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { consultationsApi, usersApi } from "@/lib/api-client"
import { ConsultationForm } from "@/components/consultation-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EditConsultationPage() {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const consultationId = parseInt(params.id as string)

    const [consultation, setConsultation] = useState<any>(null)
    const [patient, setPatient] = useState<any>(null)
    const [medecin, setMedecin] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const consultationData = await consultationsApi.getById(consultationId)
                setConsultation(consultationData)

                // Charger le patient et le médecin
                const [patientData, medecinData] = await Promise.all([
                    usersApi.getPatientById(consultationData.patientId),
                    usersApi.getMedecinById(consultationData.medecinId)
                ])

                setPatient(patientData)
                setMedecin(medecinData)
            } catch (error) {
                console.error("Erreur chargement données:", error)
                toast({
                    title: "Erreur",
                    description: "Impossible de charger la consultation",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        if (consultationId) {
            loadData()
        }
    }, [consultationId, toast])

    const handleSave = async (data: any) => {
        try {
            // CORRECTION : Inclure toutes les données de la consultation existante
            const updatedData = {
                ...consultation, // Garder toutes les données originales
                ...data, // Remplacer par les données modifiées
                // S'assurer que les IDs sont corrects
                patientId: consultation.patientId,
                medecinId: consultation.medecinId,
                date: consultation.date // Garder la date originale ou utiliser data.date si modifiable
            }

            await consultationsApi.update(consultationId, updatedData)
            toast({
                title: "Consultation mise à jour",
                description: "La consultation a été modifiée avec succès.",
            })
            router.push(`/dashboard/consultations/${consultationId}`)
        } catch (error) {
            console.error("Erreur mise à jour consultation:", error)
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour la consultation",
                variant: "destructive",
            })
        }
    }

    const handleCancel = () => {
        router.push(`/dashboard/consultations/${consultationId}`)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                <span>Chargement...</span>
            </div>
        )
    }

    if (!consultation || !patient || !medecin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground mb-4">Consultation non trouvée</p>
                <Button onClick={() => router.push("/dashboard/consultations")}>
                    Retour aux consultations
                </Button>
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
                    <h1 className="text-3xl font-bold text-foreground">Modifier la Consultation</h1>
                    <p className="text-muted-foreground">Modifiez les détails de la consultation</p>
                </div>
            </div>

            <ConsultationForm
                patient={patient}
                consultation={consultation}
                onSave={handleSave}
                onCancel={handleCancel}
                isEditing={true}
            />
        </div>
    )
}