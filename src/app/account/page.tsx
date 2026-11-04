'use client'

import { useState } from 'react'
import { LogOut, Trash2 } from 'lucide-react'
import { Button } from '@/ui/components/button'
import { Input } from '@/ui/components/input'
import { Label } from '@/ui/components/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/components/dialog'
import { useAuth } from '@/ui/hooks/use-auth'
import { useAccountActions, useGenerationUsage } from '@/ui/hooks/use-account'
import { DELETE_ACCOUNT_CONFIRMATION } from '@/application/manage-account'
import type { GenerationQuotaStatus } from '@/application/generation-quota'
import { DISPLAY_NAME_MAX_LENGTH, type User } from '@/domain/user'

function ProfileForm({ user }: { user: User }) {
  const { saveDisplayName, isSaving, error } = useAccountActions()
  const [name, setName] = useState(user.displayName ?? '')
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(await saveDisplayName(name))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="display-name">¿Cómo quieres que te llamemos?</Label>
        <div className="flex gap-2">
          <Input
            id="display-name"
            value={name}
            maxLength={DISPLAY_NAME_MAX_LENGTH}
            onChange={(e) => {
              setName(e.target.value)
              setSaved(false)
            }}
            placeholder="Tu nombre"
          />
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
        {saved && <p className="text-sm font-bold text-forest">Nombre guardado.</p>}
        {error && <p className="text-sm font-bold text-tomato">{error}</p>}
      </div>
      <dl className="grid gap-1 text-sm">
        <div className="flex gap-2">
          <dt className="text-ink-soft">Email:</dt>
          <dd className="font-bold">{user.email}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-ink-soft">Acceso con:</dt>
          <dd className="font-bold">{user.provider === 'google' ? 'Google' : 'Enlace por email'}</dd>
        </div>
      </dl>
    </form>
  )
}

function UsageMeter({ label, status }: { label: string; status: GenerationQuotaStatus }) {
  const percent = status.limit > 0 ? Math.min((status.used / status.limit) * 100, 100) : 100

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-bold">{label}</span>
        <span className="font-bold text-ink-soft">
          {status.used} de {status.limit}
        </span>
      </div>
      <div
        className="h-4 overflow-hidden rounded-full border-2 border-ink bg-paper-deep"
        role="progressbar"
        aria-valuenow={status.used}
        aria-valuemin={0}
        aria-valuemax={status.limit}
        aria-label={label}
      >
        <div
          className={percent >= 100 ? 'h-full bg-tomato transition-all' : 'h-full bg-forest transition-all'}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function DeleteAccountDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { deleteAccount, isDeleting, error } = useAccountActions()
  const [confirmation, setConfirmation] = useState('')

  const handleDelete = async () => {
    if (await deleteAccount(confirmation)) {
      window.location.href = '/'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Borrar tu cuenta?</DialogTitle>
          <DialogDescription>
            Se borrarán tu cuenta y todas tus aventuras guardadas. No se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="delete-confirmation">
            Escribe <strong>{DELETE_ACCOUNT_CONFIRMATION}</strong> para confirmar
          </Label>
          <Input
            id="delete-confirmation"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            autoComplete="off"
          />
          {error && <p className="text-sm font-bold text-tomato">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || confirmation.trim().toUpperCase() !== DELETE_ACCOUNT_CONFIRMATION}
          >
            {isDeleting ? 'Borrando...' : 'Borrar cuenta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AccountPage() {
  const { user, isLoading, signOut } = useAuth()
  const { usage, error: usageError } = useGenerationUsage()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-hand text-2xl text-ink-soft">Cargando tu cuenta...</p>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <main className="mx-auto max-w-2xl space-y-8 px-4 pb-24 pt-12">
      <div>
        <p className="font-hand text-2xl text-tomato">Tu rincón</p>
        <h1 className="text-4xl md:text-5xl">Mi cuenta</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Solo guardamos tu nombre y tu email. Nunca datos de los niños.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm key={`${user.id}-${user.displayName ?? ''}`} user={user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uso de la IA</CardTitle>
          <CardDescription>Límite en las últimas 24 horas, para que la app siga siendo gratuita.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {usage ? (
            <>
              <UsageMeter label="Aventuras creadas" status={usage.adventure} />
              <UsageMeter label="Misiones regeneradas" status={usage.mission} />
            </>
          ) : (
            <p className="text-sm text-ink-soft">{usageError ?? 'Consultando...'}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sesión</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut /> Cerrar sesión
          </Button>
          <Button variant="ghost" className="text-tomato hover:bg-tomato/10" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 /> Borrar mi cuenta
          </Button>
        </CardContent>
      </Card>

      <DeleteAccountDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
    </main>
  )
}
