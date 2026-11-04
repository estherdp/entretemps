'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { CopyPlus, Pencil, Printer, Save, Trash2 } from 'lucide-react'
import { Button } from '@/ui/components/button'
import { Label } from '@/ui/components/label'
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
import { MissionCard } from '@/ui/components/mission-card'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'
import { useUserPackDetails } from '@/ui/hooks/use-user-pack-details'
import { useDeletePack } from '@/ui/hooks/use-delete-pack'
import { useRegenerateMission } from '@/ui/hooks/use-regenerate-mission'
import { useReorderMissions } from '@/ui/hooks/use-reorder-missions'
import { useRepositories } from '@/ui/providers/repository-provider'
import { updateMyPackText, PackTextChanges } from '@/application/update-my-pack-text'
import { duplicateMyPack } from '@/application/duplicate-my-pack'
import {
  AdventureHero,
  AdventurePage,
  AdventureSection,
  CenteredMessage,
  ConclusionSection,
  IntroductionSection,
  MaterialsChecklist,
  sortMissions,
} from '@/ui/components/adventure-sections'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'

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
  // Última versión guardada: sirve para pintar y para "Cancelar" tras guardar
  const [basePack, setBasePack] = useState<SavedAdventurePack | null>(null)
  const [title, setTitle] = useState('')
  const [introStory, setIntroStory] = useState('')
  const [introSetupForParents, setIntroSetupForParents] = useState('')
  const [missionsStory, setMissionsStory] = useState<Record<number, string>>({})
  const [conclusionStory, setConclusionStory] = useState('')

  // Mission management hooks
  const { regenerateMission, isRegenerating: isRegeneratingHook, error: regenerateError } = useRegenerateMission()
  const { reorderMissions, isReordering, error: reorderError } = useReorderMissions()

  // Track which mission is being regenerated
  const [regeneratingMissionOrder, setRegeneratingMissionOrder] = useState<number | null>(null)

  // Local missions state for optimistic UI updates
  const [localMissions, setLocalMissions] = useState<GeneratedAdventurePackMission[]>([])

  // Drag and Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Scroll to top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [params.id])

  // Redirect if needs authentication
  useEffect(() => {
    if (needsAuth) {
      router.push('/login')
    }
  }, [needsAuth, router])

  const resetFields = (source: SavedAdventurePack) => {
    setTitle(source.pack.title)
    setIntroStory(source.pack.introduction.story)
    setIntroSetupForParents(source.pack.introduction.setupForParents)
    setConclusionStory(source.pack.conclusion.story)
    setMissionsStory(Object.fromEntries(source.pack.missions.map((m) => [m.order, m.story])))
  }

  // Initialize editable fields when pack is loaded
  useEffect(() => {
    if (savedPack) {
      setBasePack(savedPack)
      resetFields(savedPack)
      setLocalMissions(savedPack.pack.missions)
    }
  }, [savedPack])

  const handleSaveChanges = async () => {
    if (!savedPack) return

    try {
      setIsSaving(true)
      setSaveError(null)

      const changes: PackTextChanges = {
        title: title,
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

      setBasePack(updatedPack)
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
    const success = await deletePack(id)

    if (success) {
      setDeleteSuccess(true)
      // Breve pausa para que se vea la confirmación
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setShowDeleteDialog(false)
      // Recarga completa para que el listado se actualice
      window.location.href = '/my-adventures'
    }
    // Si hay error, se muestra en el diálogo (deleteError del hook)
  }

  const handleCancelEdit = () => {
    if (!basePack) return

    resetFields(basePack)
    setIsEditing(false)
    setSaveError(null)
  }

  /**
   * Handler para el evento DragEnd de @dnd-kit.
   * Reordena las misiones localmente y persiste el cambio en el servidor.
   */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id || !savedPack) {
      return
    }

    const oldIndex = localMissions.findIndex((m) => m.order === active.id)
    const newIndex = localMissions.findIndex((m) => m.order === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    // Actualización optimista: reordenar localmente primero
    const reorderedMissions = arrayMove(localMissions, oldIndex, newIndex)
    setLocalMissions(reorderedMissions)

    try {
      // Persistir en el servidor
      const newOrder = reorderedMissions.map((m) => m.order)
      const result = await reorderMissions(id, newOrder)

      if (result) {
        // Actualizar con el resultado del servidor (con los orders correctos)
        setLocalMissions(result)

        // Actualizar missionsStory map
        const missionsMap: Record<number, string> = {}
        result.forEach((mission) => {
          missionsMap[mission.order] = mission.story
        })
        setMissionsStory(missionsMap)
      } else {
        // Si falla, revertir al estado original
        if (savedPack) {
          setLocalMissions(savedPack.pack.missions)
        }
        if (reorderError) {
          setSaveError(reorderError)
        }
      }
    } catch (err) {
      // Si hay error, revertir al estado original
      if (savedPack) {
        setLocalMissions(savedPack.pack.missions)
      }
      const errorMessage = err instanceof Error ? err.message : 'Error al reordenar misiones'
      setSaveError(errorMessage)
    }
  }

  /**
   * Handler para regenerar una misión individual.
   */
  const handleRegenerateMission = async (missionOrder: number) => {
    if (!savedPack || regeneratingMissionOrder !== null) {
      // No permitir regeneración si:
      // - No hay pack cargado
      // - Ya hay una regeneración en curso
      return
    }

    setRegeneratingMissionOrder(missionOrder)
    setSaveError(null)

    try {
      const result = await regenerateMission(id, missionOrder)

      if (result) {
        // Actualizar la misión en el estado local
        const updatedMissions = localMissions.map((m) =>
          m.order === missionOrder ? result : m
        )
        setLocalMissions(updatedMissions)

        // Actualizar missionsStory map
        setMissionsStory({
          ...missionsStory,
          [missionOrder]: result.story,
        })
      } else if (regenerateError) {
        setSaveError(regenerateError)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al regenerar misión'
      setSaveError(errorMessage)
    } finally {
      setRegeneratingMissionOrder(null)
    }
  }

  if (isLoading) {
    return (
      <CenteredMessage>
        <p className="font-hand text-2xl text-ink-soft">Abriendo tu aventura…</p>
      </CenteredMessage>
    )
  }

  if (error || !savedPack || !basePack) {
    return (
      <CenteredMessage>
        <p className="font-bold text-tomato">{error || 'Aventura no encontrada'}</p>
        <Button onClick={() => router.push('/my-adventures')}>Volver a mis aventuras</Button>
      </CenteredMessage>
    )
  }

  const pack = basePack.pack
  const busy = isDuplicating || isDeleting

  const actions = isEditing ? null : (
    <>
      <Button onClick={() => setIsEditing(true)}>
        <Pencil /> Editar aventura
      </Button>
      <Button onClick={() => window.print()} variant="outline">
        <Printer /> Imprimir
      </Button>
      <Button onClick={handleDuplicate} disabled={busy} variant="outline">
        <CopyPlus /> {isDuplicating ? 'Duplicando...' : 'Guardar como nueva'}
      </Button>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogTrigger asChild>
          <Button variant="ghost" disabled={busy} className="text-tomato hover:bg-tomato/10">
            <Trash2 /> Eliminar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar esta aventura?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente &quot;{title}&quot; de tu colección de
              aventuras.
            </DialogDescription>
          </DialogHeader>
          {deleteSuccess && (
            <p className="rounded-xl border-2 border-forest bg-forest/10 p-3 text-sm font-bold text-forest">
              ✓ Aventura eliminada. Redirigiendo...
            </p>
          )}
          {deleteError && !deleteSuccess && (
            <p className="rounded-xl border-2 border-tomato bg-tomato/10 p-3 text-sm font-bold text-tomato">{deleteError}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting || deleteSuccess}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || deleteSuccess}>
              {isDeleting ? 'Eliminando...' : deleteSuccess ? 'Eliminada ✓' : 'Sí, eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )

  return (
    <AdventurePage>
      <AdventureHero
        pack={pack}
        kicker={isEditing ? 'Editando tu aventura' : 'De tu colección'}
        title={
          isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="pack-title">Título de la aventura</Label>
              <Input
                id="pack-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-auto py-3 font-display text-2xl md:text-3xl"
                placeholder="Título de la aventura..."
              />
            </div>
          ) : (
            <h1 className="text-4xl leading-[1.05] md:text-6xl">{title}</h1>
          )
        }
        actions={actions}
      />

      {saveError && (
        <p role="alert" className="no-print rounded-xl border-2 border-tomato bg-tomato/10 p-3 font-bold text-tomato">
          {saveError}
        </p>
      )}

      <IntroductionSection
        story={introStory}
        note={introSetupForParents}
        storySlot={
          isEditing ? (
            <Textarea
              value={introStory}
              onChange={(e) => setIntroStory(e.target.value)}
              className="min-h-32 text-base"
              placeholder="Historia de introducción..."
            />
          ) : undefined
        }
        noteSlot={
          isEditing ? (
            <Textarea
              value={introSetupForParents}
              onChange={(e) => setIntroSetupForParents(e.target.value)}
              className="min-h-24 bg-card"
              placeholder="Guía de preparación para padres..."
            />
          ) : undefined
        }
      />

      <MaterialsChecklist materials={pack.materials} />

      <AdventureSection
        kicker={`${localMissions.length} paradas en el mapa`}
        title="Misiones"
        aside={
          isEditing && localMissions.length > 0 ? (
            <p className="font-hand text-xl text-ink-soft">Arrastra las misiones para reordenarlas</p>
          ) : undefined
        }
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={localMissions.map((m) => m.order)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {sortMissions(localMissions).map((mission) => (
                <MissionCard
                  key={mission.order}
                  mission={mission}
                  isEditing={isEditing}
                  isRegenerating={regeneratingMissionOrder === mission.order}
                  missionStory={missionsStory[mission.order] || ''}
                  onStoryChange={(story) =>
                    setMissionsStory({
                      ...missionsStory,
                      [mission.order]: story,
                    })
                  }
                  onRegenerate={() => handleRegenerateMission(mission.order)}
                  isDragDisabled={!isEditing || regeneratingMissionOrder !== null}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </AdventureSection>

      <ConclusionSection
        story={conclusionStory}
        note={pack.conclusion.celebrationTip}
        storySlot={
          isEditing ? (
            <Textarea
              value={conclusionStory}
              onChange={(e) => setConclusionStory(e.target.value)}
              className="min-h-32 text-base"
              placeholder="Historia de conclusión..."
            />
          ) : undefined
        }
      />

      {isEditing && (
        <div className="no-print sticky bottom-4 z-30 flex flex-col gap-3 rounded-2xl border-2 border-ink bg-paper/95 p-3 shadow-sticker backdrop-blur sm:flex-row sm:justify-end">
          <Button onClick={handleCancelEdit} variant="outline" disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            <Save /> {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      )}

      <p className="text-center text-sm text-ink-soft">
        Pack guardado el{' '}
        {new Date(savedPack.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </AdventurePage>
  )
}
