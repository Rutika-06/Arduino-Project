/*
 * Hero.jsx
 *
 * KEY PATTERNS USED:
 * - Pure CSS animations for the blobs (see index.css `@keyframes float`).
 *   No JS animation library needed for simple effects — keeps bundle small.
 * - clamp() in CSS for fluid typography — font size scales between breakpoints
 *   automatically without @media queries.
 * - Decorative elements use aria-hidden="true" so screen readers skip them.
 */

import { MdMemory } from 'react-icons/md'

const STATS = [
  { value: '500+', label: 'Devices Connected' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '24/7', label: 'Monitoring' },
]

export default function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">

      {/* Decorative animated blobs — pure CSS, aria-hidden so screen readers skip */}
      <div className="hero__blob hero__blob--1" aria-hidden="true" />
      <div className="hero__blob hero__blob--2" aria-hidden="true" />
      <div className="hero__blob hero__blob--3" aria-hidden="true" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Live status chip */}
        <div className="hero__chip" aria-label="System status: Live">
          <span className="hero__chip-dot" aria-hidden="true" />
          <MdMemory aria-hidden="true" />
          IoT MONITORING LIVE
        </div>

        {/* Main headline */}
        <h1 className="hero__title" id="hero-title">
          Arduino <span>IoT Dashboard</span>
          <br />System
        </h1>

        <p className="hero__subtitle">
          Real-time monitoring made simple
        </p>

        {/* Stat pills */}
        <div className="hero__stats" role="list" aria-label="System statistics">
          {STATS.map(({ value, label }) => (
            <div key={label} className="hero__stat" role="listitem">
              <span className="hero__stat-value">{value}</span>
              <span className="hero__stat-label">{label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
