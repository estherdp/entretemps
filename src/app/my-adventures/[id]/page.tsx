'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card'
import { Button } from '@/ui/components/button'
import { Textarea } from '@/ui/components/textarea'
import { Input } from '@/ui/components/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/components/dialog'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'
import { useUserPackDetails } from '@/ui/hooks/use-user-pack-details'
import { useDeletePack } from '@/ui/hooks/use-delete-pack'
import { useRepositories } from '@/ui/providers/repository-provider'
import { updateMyPackText, PackTextChanges } from '@/application/update-my-pack-text'
import { duplicateMyPack } from '@/application/duplicate-my-pack'
import {
  ADVENTURE_TYPE_LABELS,
  TONE_LABELS,
  DIFFICULTY_LABELS,
  PLACE_LABELS,
} from '@/ui/wizard/labels'

export default function AdventureDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const { pack: savedPack, isLoading, error, needsAuth } = useUserPackDetails(id)
  const { adventurePackRepository } = useRepositories()

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const { deletePack, isDeleting, error: deleteError } = useDeletePack()

  // Editable text fields
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [introStory, setIntroStory] = useState('')
  const [introSetupForParents, setIntroSetupForParents] = useState('')
  const [missionsStory, setMissionsStory] = useState<Record<number, string>>({})
  const [conclusionStory, setConclusionStory] = useState('')

  // Redirect if needs authentication
  useEffect(() => {
    if (needsAuth) {
      router.push('/login')
    }
  }, [needsAuth, router])

  // Initialize editable fields when pack is loaded
  useEffect(() => {
    if (savedPack) {
      setTitle(savedPack.pack.title)
      setImageUrl(savedPack.pack.image.url)
      setIntroStory(savedPack.pack.introduction.story)
      setIntroSetupForParents(savedPack.pack.introduction.setupForParents)
      setConclusionStory(savedPack.pack.conclusion.story)

      const missionsMap: Record<number, string> = {}
      savedPack.pack.missions.forEach((mission) => {
        missionsMap[mission.order] = mission.story
      })
      setMissionsStory(missionsMap)
    }
  }, [savedPack])

  const handleSaveChanges = async () => {
    if (!savedPack) return

    try {
      setIsSaving(true)
      setSaveError(null)

      const changes: PackTextChanges = {
        title: title,
        imageUrl: imageUrl,
        introductionStory: introStory,
        introductionSetupForParents: introSetupForParents,
        conclusionStory: conclusionStory,
        missionsStory: Object.entries(missionsStory).map(([order, story]) => ({
          order: Number(order),
          story,
        })),
      }

      const updatedPack = await updateMyPackText(
        id,
        savedPack.userId,
        changes,
        adventurePackRepository
      )

      // Refrescamos el estado (opcional: podrías recargar del hook)
      setIsEditing(false)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error al guardar los cambios')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDuplicate = async () => {
    if (!savedPack) return

    try {
      setIsDuplicating(true)
      setSaveError(null)

      const newPack = await duplicateMyPack(
        id,
        savedPack.userId,
        adventurePackRepository
      )

      router.push(`/my-adventures/${newPack.id}`)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error al duplicar la aventura')
    } finally {
      setIsDuplicating(false)
    }
  }

  const handleDelete = async () => {
    console.log('[handleDelete] Iniciando eliminación...')
    const success = await deletePack(id)
    console.log('[handleDelete] Resultado de deletePack:', success)

    if (success) {
      console.log('[handleDelete] Eliminación exitosa, mostrando mensaje...')
      setDeleteSuccess(true)
      // Esperar 2 segundos para que se vean los logs
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('[handleDelete] Redirigiendo a /my-adventures')
      setShowDeleteDialog(false)
      // Forzar recarga completa de la página para actualizar el listado
      window.location.href = '/my-adventures'
    } else {
      console.error('[handleDelete] La eliminación falló')
    }
    // Si hay error, se muestra en el dialog (deleteError del hook)
  }

  const handleCancelEdit = () => {
    if (!savedPack) return

    // Reset to original values
    setTitle(savedPack.pack.title)
    setImageUrl(savedPack.pack.image.url)
    setIntroStory(savedPack.pack.introduction.story)
    setIntroSetupForParents(savedPack.pack.introduction.setupForParents)
    setConclusionStory(savedPack.pack.conclusion.story)

    const missionsMap: Record<number, string> = {}
    savedPack.pack.missions.forEach((mission) => {
      missionsMap[mission.order] = mission.story
    })
    setMissionsStory(missionsMap)

    setIsEditing(false)
    setSaveError(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando aventura...</p>
      </div>
    )
  }

  if (error || !savedPack) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-red-600">{error || 'Aventura no encontrada'}</p>
        <Button onClick={() => router.push('/my-adventures')}>
          Volver a mis aventuras
        </Button>
      </div>
    )
  }

  const pack = savedPack.pack

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Image */}
      <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-2 p-6">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground">{title}</h1>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          {/* Title Section */}
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Título de la aventura
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold h-auto py-3"
                placeholder="Título de la aventura..."
              />
            </div>
          ) : (
            imageUrl && <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          )}

          {/* Image URL Editor (only in edit mode) */}
          {isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                URL de la imagen (opcional)
              </label>
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Deja vacío para mostrar solo el título
              </p>
            </div>
          )}

          {/* Edit Mode Toggle */}
          {!isEditing && (
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(true)} variant="outline">
                ✏️ Editar aventura
              </Button>
              <Button
                onClick={handleDuplicate}
                disabled={isDuplicating || isDeleting}
                variant="outline"
              >
                {isDuplicating ? 'Duplicando...' : '📋 Guardar como nueva'}
              </Button>

              {/* Delete Button with Confirmation Dialog */}
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isDuplicating || isDeleting}
                  >
                    🗑️ Eliminar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Eliminar esta aventura?</DialogTitle>
                    <DialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente
                      "{title}" de tu colección de aventuras.
                    </DialogDescription>
                  </DialogHeader>
                  {deleteSuccess && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        ✓ Aventura eliminada exitosamente. Redirigiendo...
                      </p>
                    </div>
                  )}
                  {deleteError && !deleteSuccess && (
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        {deleteError}
                      </p>
                    </div>
                  )}
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteDialog(false)}
                      disabled={isDeleting || deleteSuccess}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting || deleteSuccess}
                    >
                      {isDeleting ? 'Eliminando...' : deleteSuccess ? 'Eliminada ✓' : 'Sí, eliminar'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Key Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Edades</p>
                  <p className="font-semibold">{pack.ageRange.min}-{pack.ageRange.max} años</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Duración</p>
                  <p className="font-semibold">{pack.estimatedDurationMinutes} min</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Participantes</p>
                  <p className="font-semibold">{pack.participants} niños</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Dificultad</p>
                  <p className="font-semibold">{DIFFICULTY_LABELS[pack.difficulty]}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Tipo</p>
                  <p className="font-semibold">{ADVENTURE_TYPE_LABELS[pack.adventureType]}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Tono</p>
                  <p className="font-semibold">{TONE_LABELS[pack.tone]}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Lugar</p>
                  <p className="font-semibold">{PLACE_LABELS[pack.place]}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {saveError && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{saveError}</p>
          </div>
        )}

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>La Aventura Comienza</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              {isEditing ? (
                <Textarea
                  value={introStory}
                  onChange={(e) => setIntroStory(e.target.value)}
                  className="min-h-32"
                  placeholder="Historia de introducción..."
                />
              ) : (
                <p className="text-base leading-relaxed">{pack.introduction.story}</p>
              )}
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                💡 Guía para padres
              </p>
              {isEditing ? (
                <Textarea
                  value={introSetupForParents}
                  onChange={(e) => setIntroSetupForParents(e.target.value)}
                  className="min-h-24 text-sm"
                  placeholder="Guía de preparación para padres..."
                />
              ) : (
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  {pack.introduction.setupForParents}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Materials */}
        {pack.materials.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Materiales Necesarios</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {pack.materials.map((material, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span className="text-sm">{material}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Missions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Misiones</h2>
          {pack.missions
            .sort((a, b) => a.order - b.order)
            .map((mission) => (
              <Card key={mission.order} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                      {mission.order}
                    </div>
                    <CardTitle className="text-xl">{mission.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Story for kids */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      📖 Historia
                    </p>
                    {isEditing ? (
                      <Textarea
                        value={missionsStory[mission.order] || ''}
                        onChange={(e) =>
                          setMissionsStory({
                            ...missionsStory,
                            [mission.order]: e.target.value,
                          })
                        }
                        className="min-h-32"
                        placeholder={`Historia de la misión ${mission.order}...`}
                      />
                    ) : (
                      <p className="text-base leading-relaxed">{mission.story}</p>
                    )}
                  </div>

                  {/* Parent Guide */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 uppercase tracking-wide">
                      👥 Guía para padres
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                      {mission.parentGuide}
                    </p>
                  </div>

                  {/* Success Condition */}
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                      <span className="font-semibold">✅ Misión completada cuando:</span>{' '}
                      {mission.successCondition}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Conclusion */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Final de la Aventura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              {isEditing ? (
                <Textarea
                  value={conclusionStory}
                  onChange={(e) => setConclusionStory(e.target.value)}
                  className="min-h-32"
                  placeholder="Historia de conclusión..."
                />
              ) : (
                <p className="text-base leading-relaxed">{pack.conclusion.story}</p>
              )}
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                🎉 Tip de celebración
              </p>
              <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                {pack.conclusion.celebrationTip}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {isEditing ? (
            <>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="flex-1"
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveChanges}
                className="flex-1"
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : '💾 Guardar cambios'}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => window.print()}
              className="w-full sm:w-auto"
            >
              Imprimir Pack
            </Button>
          )}
        </div>

        {/* Footer Info */}
        <p className="text-xs text-center text-muted-foreground pt-4">
          Pack guardado el {new Date(savedPack.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  )
}
