import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionTitle({ eyebrow, title, copy }) {
  return (
    <Reveal className="section-title">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </Reveal>
  )
}

export function ExternalLink({ href, children, className = '' }) {
  if (!href) return null
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={15} /></a>
}
