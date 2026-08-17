import React, { useEffect, useState } from 'react'
import {
  Award, BookOpen, BriefcaseBusiness, ChevronLeft, FileText, FolderKanban, ImagePlus,
  LayoutDashboard, LogOut, Menu, MessageSquare, Plus, Save, Settings, Sparkles,
  Trash2, UserRound, Wrench, X
} from 'lucide-react'
import { demoProfile } from '../data/demo'
import { blankRow, deleteRow, listTable, saveRow } from '../lib/api'
import { isSupabaseConfigured, supabase, uploadPortfolioFile } from '../lib/supabase'

const tabs = [
  ['overview', 'Overview', LayoutDashboard],
  ['profile', 'Profile', UserRound],
  ['projects', 'Projects', FolderKanban],
  ['skills', 'Skills', Wrench],
  ['experiences', 'Experience', BriefcaseBusiness],
  ['education', 'Education', BookOpen],
  ['services', 'Services', Sparkles],
  ['certifications', 'Certifications', Award],
  ['testimonials', 'Testimonials', MessageSquare],
  ['messages', 'Messages', MessageSquare],
]

const listTabs = ['projects', 'skills', 'experiences', 'education', 'services', 'certifications', 'testimonials']

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState({ loading: false, error: '' })

  async function submit(e) {
    e.preventDefault()
    setState({ loading: true, error: '' })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setState({ loading: false, error: error.message })
    else onLogin()
  }

  return <div className="admin-login-page"><div className="admin-login-orb"/><form className="admin-login-card glass" onSubmit={submit}><a className="admin-back" href="/"><ChevronLeft size={17}/> Portfolio</a><div className="admin-login-logo">SI</div><span className="admin-kicker">SECURE PORTFOLIO CMS</span><h1>Welcome back, Sakib.</h1><p>Sign in to manage your live portfolio content.</p><label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>{state.error && <div className="admin-alert error">{state.error}</div>}<button className="admin-primary" disabled={state.loading}>{state.loading ? 'Signing in…' : 'Sign in'}</button></form></div>
}

function Field({ label, children, full = false }) { return <label className={full ? 'admin-field full' : 'admin-field'}><span>{label}</span>{children}</label> }

function RowEditor({ table, row, onSaved, onDeleted }) {
  const [draft, setDraft] = useState(row)
  const [busy, setBusy] = useState(false)
  const keys = {
    projects: [['title','Title'],['category','Category'],['description','Description'],['tech_stack','Tech stack (comma separated)'],['image_url','Project image URL'],['live_url','Live URL'],['github_url','GitHub URL'],['sort_order','Sort order']],
    skills: [['name','Skill'],['category','Category'],['level','Level %'],['sort_order','Sort order']],
    experiences: [['title','Role / title'],['organization','Organization'],['period','Period'],['description','Description'],['sort_order','Sort order']],
    education: [['degree','Degree / program'],['institution','Institution'],['period','Period'],['description','Description'],['sort_order','Sort order']],
    services: [['title','Service title'],['icon','Icon (code/layers/sparkles/palette/zap)'],['description','Description'],['sort_order','Sort order']],
    certifications: [['title','Certification title'],['issuer','Issuer'],['year','Year'],['credential_url','Credential URL'],['sort_order','Sort order']],
    testimonials: [['name','Name'],['role','Role / company'],['quote','Testimonial'],['avatar_url','Avatar URL'],['sort_order','Sort order']],
  }[table]

  async function save() { setBusy(true); try { const saved = await saveRow(table, draft); setDraft(saved); onSaved(saved) } catch(e) { alert(e.message) } finally { setBusy(false) } }
  async function remove() { if (!draft.id || !confirm('Delete this item?')) return; setBusy(true); try { await deleteRow(table, draft.id); onDeleted(draft.id) } catch(e) { alert(e.message) } finally { setBusy(false) } }
  async function uploadImage(file) { if (!file) return; setBusy(true); try { const url = await uploadPortfolioFile(file, table); setDraft(d => ({...d, image_url: url})); } catch(e) { alert(e.message) } finally { setBusy(false) } }

  return <div className="editor-card">
    <div className="editor-grid">{keys.map(([key,label]) => <Field key={key} label={label} full={key === 'description' || key === 'tech_stack'}>{['description','quote'].includes(key) ? <textarea rows="4" value={draft[key] ?? ''} onChange={e => setDraft({...draft,[key]:e.target.value})}/> : <input type={['level','sort_order'].includes(key) ? 'number' : 'text'} value={draft[key] ?? ''} onChange={e => setDraft({...draft,[key]: ['level','sort_order'].includes(key) ? Number(e.target.value) : e.target.value})}/>}</Field>)}</div>
    {table === 'projects' && <label className="upload-chip"><ImagePlus size={16}/> Upload project image<input hidden type="file" accept="image/*" onChange={e => uploadImage(e.target.files?.[0])}/></label>}
    {table === 'projects' && <label className="check-row"><input type="checkbox" checked={Boolean(draft.featured)} onChange={e => setDraft({...draft,featured:e.target.checked})}/> Featured project</label>}
    <div className="editor-actions"><button className="admin-primary small" onClick={save} disabled={busy}><Save size={16}/> Save</button>{draft.id && <button className="admin-danger small" onClick={remove} disabled={busy}><Trash2 size={16}/> Delete</button>}</div>
  </div>
}

function CollectionManager({ table, label }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { listTable(table).then(setItems).finally(() => setLoading(false)) }, [table])
  function add() { setItems(v => [blankRow(table), ...v]) }
  function saved(row) { setItems(items => { const rest = items.filter(x => x.id !== row.id && x !== row); return [row, ...rest.filter(x => x.id)] }) }
  return <div><div className="admin-page-head"><div><span>CONTENT MANAGER</span><h2>{label}</h2></div><button className="admin-primary" onClick={add}><Plus size={17}/> Add new</button></div>{loading ? <div className="admin-empty">Loading…</div> : <div className="editor-list">{items.length === 0 && <div className="admin-empty">No items yet. Add your first one.</div>}{items.map((item,index) => <RowEditor key={item.id || `new-${index}`} table={table} row={item} onSaved={saved} onDeleted={id => setItems(v => v.filter(x => x.id !== id))}/>)}</div>}</div>
}

function ProfileManager() {
  const [profile, setProfile] = useState(demoProfile)
  const [busy, setBusy] = useState(false)
  useEffect(() => { supabase.from('profile').select('*').eq('id',1).maybeSingle().then(({data}) => data && setProfile({...demoProfile,...data})) }, [])
  const fields = [['full_name','Full name'],['short_name','Short name'],['headline','Professional headline'],['availability','Availability text'],['hero_text','Hero introduction'],['about_title','About title'],['bio','About / bio'],['location','Location'],['email','Email'],['phone','Phone'],['github_url','GitHub URL'],['linkedin_url','LinkedIn URL'],['facebook_url','Facebook URL'],['avatar_url','Profile photo URL'],['resume_url','CV / Resume URL'],['years_experience','Years experience'],['projects_count','Project count'],['clients_count','Client count']]
  async function upload(file, field, folder) { if (!file) return; setBusy(true); try { const url = await uploadPortfolioFile(file,folder); setProfile(p => ({...p,[field]:url})) } catch(e){alert(e.message)} finally{setBusy(false)} }
  async function save(e){ e.preventDefault(); setBusy(true); const {error}=await supabase.from('profile').upsert({...profile,id:1}); setBusy(false); if(error) alert(error.message); else alert('Profile saved.') }
  return <form onSubmit={save}><div className="admin-page-head"><div><span>PERSONAL BRAND</span><h2>Profile & hero</h2></div><button className="admin-primary" disabled={busy}><Save size={17}/> Save profile</button></div><div className="profile-editor editor-card"><div className="editor-grid">{fields.map(([key,label]) => <Field key={key} label={label} full={['hero_text','about_title','bio'].includes(key)}>{['hero_text','bio'].includes(key) ? <textarea rows={key==='bio'?6:4} value={profile[key] ?? ''} onChange={e=>setProfile({...profile,[key]:e.target.value})}/> : <input value={profile[key] ?? ''} onChange={e=>setProfile({...profile,[key]:e.target.value})}/>}</Field>)}</div><div className="upload-row"><label className="upload-chip"><ImagePlus size={16}/> Upload profile photo<input hidden type="file" accept="image/*" onChange={e=>upload(e.target.files?.[0],'avatar_url','avatar')}/></label><label className="upload-chip"><FileText size={16}/> Upload CV / PDF<input hidden type="file" accept="application/pdf" onChange={e=>upload(e.target.files?.[0],'resume_url','resume')}/></label></div></div></form>
}

function Messages() {
  const [items,setItems]=useState([])
  async function load(){const {data,error}=await supabase.from('messages').select('*').order('created_at',{ascending:false}); if(!error)setItems(data||[])}
  useEffect(()=>{load()},[])
  async function remove(id){if(!confirm('Delete this message?'))return; await supabase.from('messages').delete().eq('id',id); load()}
  return <div><div className="admin-page-head"><div><span>INBOX</span><h2>Contact messages</h2></div></div><div className="message-list">{items.length===0&&<div className="admin-empty">No messages yet.</div>}{items.map(m=><article className="message-card" key={m.id}><div><span>{new Date(m.created_at).toLocaleString()}</span><h3>{m.subject}</h3><strong>{m.name} · {m.email}</strong><p>{m.message}</p></div><button className="icon-danger" onClick={()=>remove(m.id)}><Trash2 size={16}/></button></article>)}</div></div>
}

function Overview() {
  return <div><div className="admin-page-head"><div><span>CONTROL CENTER</span><h2>Portfolio dashboard</h2></div><a className="admin-secondary" href="/" target="_blank" rel="noreferrer">Open website ↗</a></div><div className="overview-hero"><div><span className="admin-kicker">MD. SHORIFUL ISLAM (SAKIB)</span><h3>Your portfolio is now a manageable digital product.</h3><p>Use the navigation to update text, projects, skills, experience, education, services, certifications, images, CV and contact messages.</p></div><div className="overview-orb"/></div><div className="overview-grid">{[['Profile','Edit your identity, hero, links and CV.'],['Projects','Add screenshots, stack, live links and GitHub.'],['Content','Update skills, journey, services and credentials.'],['Inbox','Read messages submitted from the portfolio.']].map(([t,c])=><div className="overview-card" key={t}><span>✓</span><h4>{t}</h4><p>{c}</p></div>)}</div></div>
}

function Dashboard({ session }) {
  const [tab,setTab]=useState('overview')
  const [sidebar,setSidebar]=useState(false)
  const label=tabs.find(x=>x[0]===tab)?.[1]
  return <div className="admin-shell"><aside className={sidebar?'admin-sidebar open':'admin-sidebar'}><div className="admin-brand"><div>SI</div><span><b>Sakib</b><small>Portfolio CMS</small></span><button onClick={()=>setSidebar(false)}><X/></button></div><nav>{tabs.map(([key,text,Icon])=><button className={tab===key?'active':''} key={key} onClick={()=>{setTab(key);setSidebar(false)}}><Icon size={18}/>{text}</button>)}</nav><div className="admin-sidebar-foot"><span>{session.user.email}</span><button onClick={()=>supabase.auth.signOut()}><LogOut size={17}/> Sign out</button><a href="/"><ChevronLeft size={17}/> Back to site</a></div></aside><main className="admin-main"><header className="admin-topbar"><button className="admin-menu" onClick={()=>setSidebar(true)}><Menu/></button><div><small>Admin /</small> <strong>{label}</strong></div><div className="admin-status"><i/> Live CMS</div></header><div className="admin-content">{tab==='overview'&&<Overview/>}{tab==='profile'&&<ProfileManager/>}{listTabs.includes(tab)&&<CollectionManager table={tab} label={label}/>} {tab==='messages'&&<Messages/>}</div></main></div>
}

export default function Admin() {
  const [session,setSession]=useState(undefined)
  useEffect(()=>{if(!isSupabaseConfigured){setSession(null);return} supabase.auth.getSession().then(({data})=>setSession(data.session)); const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,s)=>setSession(s)); return()=>subscription.unsubscribe()},[])
  if (!isSupabaseConfigured) return <div className="setup-required"><div className="setup-card glass"><Settings size={42}/><span>SUPABASE REQUIRED</span><h1>Admin panel needs a backend connection.</h1><p>The public portfolio works in demo mode. To enable login, editing and uploads, add your Supabase URL and anon key to <code>.env</code> locally and to Render Environment in production.</p><a className="admin-primary" href="/">View demo portfolio</a></div></div>
  if(session===undefined) return <div className="page-loader"><div className="loader-orb"/></div>
  if(!session) return <Login onLogin={()=>{}}/>
  return <Dashboard session={session}/>
}
