"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usersApi } from "@/lib/api-client"
import type { Medecin as ApiMedecin } from "@/lib/api-client" // 🔥 IMPORT EXPLICITE
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookAppointmentDialog } from "@/components/book-appointment-dialog"
import { Search, MapPin, Phone, Clock, Star, Calendar, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MedecinsPage() {
    const router = useRouter()
    const [medecins, setMedecins] = useState<ApiMedecin[]>([]) // 🔥 UTILISER ApiMedecin
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSpeciality, setSelectedSpeciality] = useState<string | null>(null)
    const [selectedMedecin, setSelectedMedecin] = useState<ApiMedecin | null>(null) // 🔥 UTILISER ApiMedecin
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
    const { toast } = useToast()

    // Charger les médecins depuis l'API
    useEffect(() => {
        const loadMedecins = async () => {
            try {
                setLoading(true)
                const medecinsData = await usersApi.getMedecins()
                setMedecins(medecinsData)
            } catch (error) {
                console.error("Erreur chargement médecins:", error)
                toast({
                    title: "Erreur",
                    description: "Impossible de charger la liste des médecins",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        loadMedecins()
    }, [toast])

    // Récupérer les spécialités uniques
    const specialities = Array.from(new Set(medecins.map((m) => m.specialite)))

    // Filtrer les médecins
    const filteredMedecins = medecins.filter((medecin) => {
        const matchesSearch =
            searchTerm === "" ||
            medecin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medecin.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medecin.specialite.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesSpeciality = selectedSpeciality === null || medecin.specialite === selectedSpeciality

        return matchesSearch && matchesSpeciality
    })

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XOF",
            minimumFractionDigits: 0,
        }).format(price)
    }

    const handleBookAppointment = (medecin: ApiMedecin) => { // 🔥 UTILISER ApiMedecin
        setSelectedMedecin(medecin)
        setIsBookingDialogOpen(true)
    }

    const handleViewProfile = (medecin: ApiMedecin) => { // 🔥 UTILISER ApiMedecin
        router.push(`/medecin/${medecin.id}`)
    }

    const handleBookingConfirm = (data: any) => {
        toast({
            title: "Rendez-vous demandé",
            description: "Votre demande de rendez-vous a été envoyée. Vous recevrez une confirmation par email.",
        })
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Trouver un Médecin</h1>
                    <p className="text-muted-foreground">Chargement des médecins...</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-muted"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-6 bg-muted rounded w-3/4"></div>
                                        <div className="h-4 bg-muted rounded w-1/2"></div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted rounded"></div>
                                    <div className="h-4 bg-muted rounded"></div>
                                </div>
                                <div className="h-10 bg-muted rounded"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Trouver un Médecin</h1>
                <p className="text-muted-foreground">Recherchez et prenez rendez-vous avec nos médecins qualifiés</p>
            </div>

            {/* Search and Filter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom ou spécialité..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={selectedSpeciality === null ? "default" : "outline"}
                                onClick={() => setSelectedSpeciality(null)}
                                size="sm"
                            >
                                Tous
                            </Button>
                            {specialities.map((speciality) => (
                                <Button
                                    key={speciality}
                                    variant={selectedSpeciality === speciality ? "default" : "outline"}
                                    onClick={() => setSelectedSpeciality(speciality)}
                                    size="sm"
                                >
                                    {speciality}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {filteredMedecins.length} médecin{filteredMedecins.length > 1 ? "s" : ""} trouvé
                    {filteredMedecins.length > 1 ? "s" : ""}
                </p>
            </div>

            {/* Doctors List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredMedecins.map((medecin) => (
                    <Card key={medecin.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-xl">
                                        Dr. {medecin.prenom} {medecin.nom}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        <Badge variant="secondary" className="mt-1">
                                            {medecin.specialite}
                                        </Badge>
                                    </CardDescription>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                                        <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-muted-foreground">{medecin.adresseCabinet}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{medecin.telephone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Disponible sur rendez-vous</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-muted-foreground">Tarif consultation</span>
                                    <span className="text-lg font-bold text-primary">
                                        {medecin.tarifConsultation ? formatPrice(medecin.tarifConsultation) : "Non spécifié"}
                                    </span>
                                </div>
                                <Button
                                    className="w-full gap-2 mb-2"
                                    onClick={() => handleBookAppointment(medecin)}
                                >
                                    <Calendar className="w-4 h-4" />
                                    Prendre rendez-vous
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full gap-2 bg-transparent"
                                    onClick={() => handleViewProfile(medecin)}
                                >
                                    <User className="w-4 h-4" />
                                    Voir le profil complet
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredMedecins.length === 0 && !loading && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Aucun médecin trouvé</h3>
                            <p className="text-muted-foreground mb-4">Essayez de modifier vos critères de recherche</p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("")
                                    setSelectedSpeciality(null)
                                }}
                            >
                                Réinitialiser les filtres
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {selectedMedecin && (
                <BookAppointmentDialog
                    open={isBookingDialogOpen}
                    onOpenChange={setIsBookingDialogOpen}
                    medecin={selectedMedecin as any}  // 🔥 CORRECTION : ajouter 'as any'
                    onBook={handleBookingConfirm}
                />
            )}
        </div>
    )
}