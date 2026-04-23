import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from './profile-form'
import type { Profile } from '@/types'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Mi perfil</h1>
        <p className="text-slate-500 text-sm mt-1">
          Estos datos aparecerán en todos tus presupuestos.
        </p>
      </div>

      <ProfileForm profile={profile as Profile | null} userId={user!.id} />
    </div>
  )
}
