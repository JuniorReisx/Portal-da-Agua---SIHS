import { React } from 'jimu-core'
import './light-water.css'

type Motif = 'ripple' | 'contour' | 'bubbles' | 'current' | 'dune' | 'orbit' | 'spray' | 'grain'

const Contour = () => (
  <svg viewBox="0 0 480 260" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 46c70 28 130-34 210-6s130 34 200 4 50 8 70-6" />
    <path d="M0 112c80-30 150 36 230 4s140-28 190 8 40 16 60 6" />
    <path d="M0 178c60 22 140-26 220 2s150 30 200-8 30-10 60 4" />
    <path d="M20 228c90-24 150 20 240-4s140 18 200-12" />
  </svg>
)

const Current = () => (
  <svg viewBox="0 0 520 280" aria-hidden="true">
    <path d="M-10 70C90 10 170 150 290 78s150-20 230 24" />
    <path d="M-20 128C80 60 180 190 310 120s160-8 230 36" />
    <path d="M30 196C140 140 220 240 360 176s120 8 180 28" />
  </svg>
)

const Dune = () => (
  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 78c120-46 240-46 360 0s240 46 360 0 240-46 360 0 240 46 360 0v42H0z" />
    <path d="M0 96c160-28 240 18 400-8s240 22 400-6 280 16 400 4 120-8 240-10v44H0z" />
  </svg>
)

const LightWater = ({ motif = 'ripple' }: { motif?: Motif }) => {
  if (motif === 'contour') {
    return (
      <div className="lw lw--contour" aria-hidden="true">
        <Contour />
      </div>
    )
  }

  if (motif === 'current') {
    return (
      <div className="lw lw--current" aria-hidden="true">
        <Current />
      </div>
    )
  }

  if (motif === 'dune') {
    return (
      <div className="lw lw--dune" aria-hidden="true">
        <Dune />
      </div>
    )
  }

  if (motif === 'bubbles') {
    return (
      <div className="lw lw--bubbles" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    )
  }

  if (motif === 'orbit') {
    return (
      <div className="lw lw--orbit" aria-hidden="true">
        <span /><span /><span />
      </div>
    )
  }

  if (motif === 'spray') {
    return (
      <div className="lw lw--spray" aria-hidden="true">
        <span /><span /><span /><i />
      </div>
    )
  }

  if (motif === 'grain') {
    return (
      <div className="lw lw--grain" aria-hidden="true">
        <span /><span /><span /><span /><span /><span /><span />
      </div>
    )
  }

  return (
    <div className="lw lw--ripple" aria-hidden="true">
      <span /><span /><span />
    </div>
  )
}

export default LightWater
