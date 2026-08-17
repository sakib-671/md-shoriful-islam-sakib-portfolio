import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDown, ArrowRight, BriefcaseBusiness, CheckCircle2, Code2, Download, Github,
  Layers3, Linkedin, Mail, MapPin, Menu, MessageCircle, Palette, Phone, Send,
  Sparkles, X, Zap, Award, GraduationCap
} from 'lucide-react'
import ThreeScene from '../components/ThreeScene'
import { ExternalLink, Reveal, SectionTitle } from '../components/Ui'
import { loadPortfolioData, sendMessage } from '../lib/api'

const serviceIcons = { code: Code2, layers: Layers3, sparkles: Sparkles, palette: Palette, zap: Zap }

function ProjectVisual({ project, index }) {
  if (project.image_url) return <img src={project.image_url} alt={project.title} loading="lazy" />
  return (
    <div className={`project-art art-${(index % 3) + 1}`}>
      <div className="browser-dot-row"><i /><i /><i /></div>
      <div className="project-art-grid"><span /><span /><span /><span /></div>
      <strong>{project.category || 'Project'}</strong>
    </div>
  )
}

export default function Portfolio() {
  const [data, setData] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [messageState, setMessageState] = useState({ status: '', text: '' })

  useEffect(() => {
    loadPortfolioData().then(setData).catch(() => loadPortfolioData().then(setData))
  }, [])

  const groupedSkills = useMemo(() => {
    if (!data) return {}
    return data.skills.reduce((acc, item) => {
      const key = item.category || 'Skills'
      acc[key] ||= []
      acc[key].push(item)
      return acc
    }, {})
  }, [data])

  async function handleMessage(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    setMessageState({ status: 'loading', text: 'Sending…' })
    try {
      const result = await sendMessage(payload)
      e.currentTarget.reset()
      setMessageState({
        status: 'success',
        text: result.demo ? 'Demo mode: connect Supabase to receive messages.' : 'Message sent successfully.',
      })
    } catch (error) {
      setMessageState({ status: 'error', text: error.message || 'Could not send message.' })
    }
  }

  if (!data) return <div className="page-loader"><div className="loader-orb" /><span>Loading Sakib’s portfolio…</span></div>
  const p = data.profile

  return (
    <div className="portfolio-shell">
      <div className="aurora aurora-a" /><div className="aurora aurora-b" /><div className="noise" />

      <header className="site-nav glass">
        <a className="logo" href="#home"><span>SI</span><b>Sakib</b></a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map(label => (
            <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          {p.resume_url && <a className="nav-cv" href={p.resume_url} target="_blank" rel="noreferrer">CV <Download size={14} /></a>}
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="hero section" id="home">
          <div className="hero-grid">
            <motion.div className="hero-copy" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
              <div className="availability-pill"><span className="pulse-dot" />{p.availability || 'Available for opportunities'}</div>
              <span className="hero-overline">HELLO, I’M</span>
              <h1><span className="name-line">MD. Shoriful Islam</span><span className="gradient-text">(Sakib)</span></h1>
              <h2>{p.headline}</h2>
              <p>{p.hero_text || p.bio}</p>
              <div className="hero-actions">
                <a className="btn btn-primary magnetic" href="#projects">Explore my work <ArrowRight size={18} /></a>
                <a className="btn btn-ghost" href="#contact">Let’s talk <MessageCircle size={18} /></a>
              </div>
              <div className="social-row">
                {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a>}
                {p.linkedin_url && <a href={p.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a>}
                {p.email && <a href={`mailto:${p.email}`} aria-label="Email"><Mail /></a>}
              </div>
            </motion.div>

            <motion.div className="hero-visual" initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .15 }}>
              <div className="scene-card glass">
                <ThreeScene />
                {p.avatar_url && <div className="hero-profile-card glass"><img src={p.avatar_url} alt={p.full_name} /><span><b>{p.short_name || 'Sakib'}</b><small>{p.headline}</small></span></div>}
                <div className="orbit-label label-react">React</div>
                <div className="orbit-label label-ui">Creative UI</div>
                <div className="orbit-label label-full">Full Stack</div>
              </div>
              <div className="scroll-hint"><ArrowDown size={16} /> Scroll to explore</div>
            </motion.div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="about-grid">
            <SectionTitle eyebrow="01 / ABOUT" title={p.about_title || 'A developer who cares about the details.'} />
            <Reveal className="about-content" delay={.08}>
              <p className="lead-copy">{p.bio}</p>
              <div className="about-meta">
                {p.location && <span><MapPin size={17} />{p.location}</span>}
                {p.email && <span><Mail size={17} />{p.email}</span>}
                {p.phone && <span><Phone size={17} />{p.phone}</span>}
              </div>
            </Reveal>
          </div>
          <div className="stats-grid">
            {[['Years Experience', p.years_experience], ['Projects', p.projects_count], ['Happy Clients', p.clients_count], ['Focus', 'Quality']].map(([label, value], i) => (
              <Reveal key={label} className="stat-card glass" delay={i * .05}><strong>{value || '—'}</strong><span>{label}</span></Reveal>
            ))}
          </div>
        </section>

        {data.services.length > 0 && <section className="section services-section">
          <SectionTitle eyebrow="02 / WHAT I DO" title="From idea to polished digital experience." copy="Flexible skills for building products that look sharp, feel smooth and work reliably." />
          <div className="services-grid">
            {data.services.map((service, index) => {
              const Icon = serviceIcons[service.icon] || Code2
              return <Reveal className="service-card glass" key={service.id} delay={index * .06}><div className="service-icon"><Icon /></div><h3>{service.title}</h3><p>{service.description}</p><span className="service-index">0{index + 1}</span></Reveal>
            })}
          </div>
        </section>}

        <section className="section" id="skills">
          <SectionTitle eyebrow="03 / SKILLS" title="Technology, craft and execution." />
          <div className="skill-layout">
            {Object.entries(groupedSkills).map(([category, skills], groupIndex) => (
              <Reveal className="skill-panel glass" key={category} delay={groupIndex * .05}>
                <div className="skill-panel-head"><h3>{category}</h3><span>{String(groupIndex + 1).padStart(2, '0')}</span></div>
                {skills.map(skill => <div className="skill-row" key={skill.id}><div><span>{skill.name}</span><b>{skill.level || 0}%</b></div><div className="skill-track"><i style={{ width: `${skill.level || 0}%` }} /></div></div>)}
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" id="projects">
          <SectionTitle eyebrow="04 / PROJECTS" title="Selected work, built to be useful." copy="Project cards, screenshots, technology tags and links are all managed from the admin dashboard." />
          <div className="projects-grid">
            {data.projects.map((project, index) => (
              <Reveal className={`project-card ${project.featured ? 'featured' : ''}`} key={project.id} delay={(index % 3) * .05}>
                <div className="project-media"><ProjectVisual project={project} index={index} /><span className="project-category">{project.category || 'Project'}</span></div>
                <div className="project-copy">
                  <div className="project-title-row"><h3>{project.title}</h3><span>{String(index + 1).padStart(2, '0')}</span></div>
                  <p>{project.description}</p>
                  <div className="tag-row">{(project.tech_stack || '').split(',').filter(Boolean).map(tag => <span key={tag}>{tag.trim()}</span>)}</div>
                  <div className="project-links"><ExternalLink href={project.live_url}>Live project</ExternalLink><ExternalLink href={project.github_url}>Source code</ExternalLink></div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" id="experience">
          <SectionTitle eyebrow="05 / JOURNEY" title="Experience & education." />
          <div className="journey-grid">
            <Reveal className="journey-column">
              <div className="journey-heading"><BriefcaseBusiness /><h3>Experience</h3></div>
              <div className="timeline">{data.experiences.map(item => <article className="timeline-item" key={item.id}><div className="timeline-dot" /><span className="timeline-period">{item.period}</span><h4>{item.title}</h4><strong>{item.organization}</strong><p>{item.description}</p></article>)}</div>
            </Reveal>
            <Reveal className="journey-column" delay={.08}>
              <div className="journey-heading"><GraduationCap /><h3>Education</h3></div>
              <div className="timeline">{data.education.map(item => <article className="timeline-item" key={item.id}><div className="timeline-dot" /><span className="timeline-period">{item.period}</span><h4>{item.degree}</h4><strong>{item.institution}</strong><p>{item.description}</p></article>)}</div>
            </Reveal>
          </div>
        </section>

        {data.certifications.length > 0 && <section className="section">
          <SectionTitle eyebrow="06 / CREDENTIALS" title="Certifications & achievements." />
          <div className="cert-grid">{data.certifications.map((item, i) => <Reveal className="cert-card glass" key={item.id} delay={i * .04}><Award /><div><span>{item.year}</span><h3>{item.title}</h3><p>{item.issuer}</p>{item.credential_url && <ExternalLink href={item.credential_url}>View credential</ExternalLink>}</div></Reveal>)}</div>
        </section>}

        {data.testimonials.length > 0 && <section className="section">
          <SectionTitle eyebrow="07 / TESTIMONIALS" title="What people say about working with me." />
          <div className="testimonial-grid">{data.testimonials.map((item, i) => <Reveal className="testimonial-card glass" key={item.id} delay={i * .05}><div className="quote-mark">“</div><p>{item.quote}</p><div className="testimonial-person">{item.avatar_url ? <img src={item.avatar_url} alt={item.name}/> : <span>{item.name?.[0] || 'S'}</span>}<div><b>{item.name}</b><small>{item.role}</small></div></div></Reveal>)}</div>
        </section>}

        <section className="section contact-section" id="contact">
          <div className="contact-panel glass">
            <Reveal className="contact-copy"><span className="eyebrow">08 / CONTACT</span><h2>Have an idea?<br/><span className="gradient-text">Let’s build it.</span></h2><p>Use the form or reach out directly. I’m open to projects, collaborations and relevant opportunities.</p><div className="contact-direct">{p.email && <a href={`mailto:${p.email}`}><Mail />{p.email}</a>}{p.phone && <a href={`tel:${p.phone}`}><Phone />{p.phone}</a>}</div></Reveal>
            <Reveal delay={.08}>
              <form className="contact-form" onSubmit={handleMessage}>
                <div className="form-two"><label>Name<input name="name" required maxLength="100" placeholder="Your name" /></label><label>Email<input name="email" type="email" required maxLength="180" placeholder="you@example.com" /></label></div>
                <label>Subject<input name="subject" required maxLength="160" placeholder="What would you like to discuss?" /></label>
                <label>Message<textarea name="message" required maxLength="4000" rows="6" placeholder="Tell me about your project or opportunity…" /></label>
                <button className="btn btn-primary" type="submit" disabled={messageState.status === 'loading'}>{messageState.status === 'loading' ? 'Sending…' : <>Send message <Send size={17} /></>}</button>
                {messageState.text && <p className={`form-status ${messageState.status}`}>{messageState.status === 'success' && <CheckCircle2 size={16} />}{messageState.text}</p>}
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer"><div><a className="logo" href="#home"><span>SI</span><b>Sakib</b></a><p>© {new Date().getFullYear()} MD. Shoriful Islam (Sakib). Built with React.</p></div><div className="footer-links"><a href="#home">Back to top ↑</a><a href="/admin">Admin</a></div></footer>
      {data.demoMode && <div className="demo-badge">Demo data · Connect Supabase for live admin</div>}
    </div>
  )
}
