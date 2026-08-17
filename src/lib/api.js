import { isSupabaseConfigured, supabase } from './supabase'
import { demoCertifications, demoEducation, demoExperiences, demoProfile, demoProjects, demoServices, demoSkills } from '../data/demo'

const collections = {
  projects: demoProjects,
  skills: demoSkills,
  experiences: demoExperiences,
  education: demoEducation,
  services: demoServices,
  certifications: demoCertifications,
}

export async function loadPortfolioData() {
  if (!isSupabaseConfigured) {
    return {
      demoMode: true,
      profile: demoProfile,
      projects: demoProjects,
      skills: demoSkills,
      experiences: demoExperiences,
      education: demoEducation,
      services: demoServices,
      certifications: demoCertifications,
      testimonials: [],
    }
  }

  const [profile, projects, skills, experiences, education, services, certifications, testimonials] = await Promise.all([
    supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
    supabase.from('projects').select('*').order('sort_order').order('created_at', { ascending: false }),
    supabase.from('skills').select('*').order('sort_order'),
    supabase.from('experiences').select('*').order('sort_order'),
    supabase.from('education').select('*').order('sort_order'),
    supabase.from('services').select('*').order('sort_order'),
    supabase.from('certifications').select('*').order('sort_order'),
    supabase.from('testimonials').select('*').order('sort_order'),
  ])

  return {
    demoMode: false,
    profile: profile.data || demoProfile,
    projects: projects.data || [],
    skills: skills.data || [],
    experiences: experiences.data || [],
    education: education.data || [],
    services: services.data || [],
    certifications: certifications.data || [],
    testimonials: testimonials.data || [],
  }
}

export function blankRow(table) {
  const map = {
    projects: { title: '', description: '', tech_stack: '', category: 'Web App', image_url: '', live_url: '', github_url: '', featured: false, sort_order: 0 },
    skills: { name: '', category: 'Frontend', level: 80, sort_order: 0 },
    experiences: { title: '', organization: '', period: '', description: '', sort_order: 0 },
    education: { degree: '', institution: '', period: '', description: '', sort_order: 0 },
    services: { title: '', icon: 'code', description: '', sort_order: 0 },
    certifications: { title: '', issuer: '', year: '', credential_url: '', sort_order: 0 },
    testimonials: { name: '', role: '', quote: '', avatar_url: '', sort_order: 0 },
  }
  return map[table] || {}
}

export async function listTable(table) {
  if (!supabase) return collections[table] || []
  const query = supabase.from(table).select('*').order('sort_order')
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function saveRow(table, row) {
  if (!supabase) throw new Error('Configure Supabase first.')
  const payload = { ...row }
  if (typeof payload.id === 'string' && payload.id.startsWith('demo-')) delete payload.id
  if (!payload.id) delete payload.id
  const { data, error } = await supabase.from(table).upsert(payload).select().single()
  if (error) throw error
  return data
}

export async function deleteRow(table, id) {
  if (!supabase) throw new Error('Configure Supabase first.')
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}

export async function sendMessage(message) {
  if (!supabase) return { demo: true }
  const { error } = await supabase.from('messages').insert(message)
  if (error) throw error
  return { demo: false }
}
