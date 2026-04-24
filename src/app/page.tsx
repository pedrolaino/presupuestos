import { createClient } from '@/lib/supabase/server'
import { LandingContent } from './landing-content'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <LandingContent isLoggedIn={!!user} />
}
