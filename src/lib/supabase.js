import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const isSupabaseConfigured = Boolean(url && anonKey)
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null

export async function uploadPortfolioFile(file, folder = 'uploads') {
  if (!supabase) throw new Error('Supabase is not configured.')
  const cleanName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-')
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}-${cleanName}`
  const { error } = await supabase.storage.from('portfolio').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from('portfolio').getPublicUrl(path)
  return data.publicUrl
}
