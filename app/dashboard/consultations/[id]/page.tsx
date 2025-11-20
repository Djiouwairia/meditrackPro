      // consultation/[id]/page.tsx
"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { consultationsApi, usersApi } from "@/lib/api-client"
import { ConsultationDetailView } from "@/components/consultation-detail-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ConsultationDetailPage() {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const consultationId = parseInt(params.id as string)

    const [consultation, setConsultation] = useState<any>(null)
    const [patient, setPatient] = useState<any>(null)
    const [medecin, setMedecin] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadConsultationData = async () => {
            try {
                setLoading(true)
                const consultationData = await consultationsApi.getById(consultationId)
                setConsultation(consultationData)

                // Charger les données du patient et du médecin
                const [patientData, medecinData] = await Promise.all([
                    usersApi.getPatientById(consultationData.patientId),
                    usersApi.getMedecinById(consultationData.medecinId)
                ])

                setPatient(patientData)
                setMedecin(medecinData)
            } catch (error) {
                console.error("Erreur chargement consultation:", error)
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
            loadConsultationData()
        }
    }, [consultationId, toast])

    const handleEdit = () => {
        router.push(`/dashboard/consultations/${consultationId}/edit`)
    }

    const handlePrint = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                <span>Chargement de la consultation...</span>
            </div>
        )
    }

    if (!consultation || !patient || !medecin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground mb-4">Consultation non trouvée</p>
                <Button onClick={() => router.push("/dashboard/consultations")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
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
            </div>

            <ConsultationDetailView
                consultation={consultation}
                patient={patient}
                medecin={medecin}
                onEdit={handleEdit}
                onPrint={handlePrint}
            />
        </div>
    )
}