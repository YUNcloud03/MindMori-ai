import { useEffect } from 'react'
import { motion } from 'framer-motion'

// MindMori AI brand logo — shield with brain + mushroom (SVG, matches brand design)
function MindMoriLogo({ size = 96 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C7B5E8" />
          <stop offset="100%" stopColor="#8F76BC" />
        </linearGradient>
        <linearGradient id="brainGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B8A7D6" />
          <stop offset="100%" stopColor="#7B62A8" />
        </linearGradient>
      </defs>
      {/* Shield body */}
      <path d="M48 6L82 20v30c0 20-16 34-34 40C14 84 14 70 14 50V20Z"
        fill="url(#shieldGrad)" opacity="0.18" stroke="url(#shieldGrad)" strokeWidth="2.5" />
      {/* Inner shield glow */}
      <path d="M48 12L76 24v26c0 17-13 28-28 34C20 78 20 67 20 50V24Z"
        fill="white" opacity="0.35" />
      {/* Brain left hemisphere */}
      <ellipse cx="40" cy="40" rx="11" ry="9" fill="url(#brainGrad)" opacity="0.9" />
      {/* Brain right hemisphere */}
      <ellipse cx="56" cy="40" rx="11" ry="9" fill="url(#brainGrad)" opacity="0.9" />
      {/* Brain centre crease */}
      <line x1="48" y1="31" x2="48" y2="49" stroke="white" strokeWidth="1.5" opacity="0.6" />
      {/* Brain highlight bumps */}
      <circle cx="37" cy="37" r="3" fill="white" opacity="0.35" />
      <circle cx="59" cy="37" r="3" fill="white" opacity="0.35" />
      <circle cx="48" cy="35" r="2.5" fill="white" opacity="0.3" />
      {/* Mushroom cap */}
      <ellipse cx="48" cy="60" rx="13" ry="6" fill="#B8A7D6" opacity="0.85" />
      {/* Mushroom stem */}
      <rect x="44.5" y="60" width="7" height="11" rx="3.5" fill="#EFE8F7" />
      {/* Leaf sprigs left */}
      <path d="M32 65 Q26 60 28 54 Q31 62 32 65Z" fill="#B7C3B0" opacity="0.8" />
      <path d="M30 68 Q22 65 24 58 Q29 66 30 68Z" fill="#A8C2A0" opacity="0.7" />
      {/* Leaf sprigs right */}
      <path d="M64 65 Q70 60 68 54 Q65 62 64 65Z" fill="#B7C3B0" opacity="0.8" />
      <path d="M66 68 Q74 65 72 58 Q67 66 66 68Z" fill="#A8C2A0" opacity="0.7" />
      {/* Sparkle dots */}
      <circle cx="22" cy="32" r="1.5" fill="#C7B5E8" opacity="0.7" />
      <circle cx="74" cy="28" r="1.5" fill="#C7B5E8" opacity="0.7" />
      <circle cx="70" cy="55" r="1" fill="#B8A7D6" opacity="0.6" />
    </svg>
  )
}

export default function LoadingPage({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center"
         style={{ background: 'linear-gradient(160deg, #FAF8F3 0%, #EFE8F7 50%, #F4F1EC 100%)' }}>

      {/* Soft ambient background circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(184,167,214,${0.07 - i * 0.01}) 0%, transparent 70%)`,
              width: `${380 + i * 140}px`,
              height: `${380 + i * 140}px`,
              left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}
        {/* Floating mushroom particles */}
        {['🍄', '🌿', '🍄', '✨', '🌱'].map((emoji, i) => (
          <motion.div key={`p${i}`}
            className="absolute text-lg select-none pointer-events-none"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 2) * 50}%`,
              opacity: 0.25,
            }}
            animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
            transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Main logo card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-7 relative z-10"
      >
        {/* Logo with spinning ring */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="148" height="148" viewBox="0 0 148 148">
              <circle cx="74" cy="74" r="68" fill="none" stroke="#C7B5E8" strokeWidth="1" strokeDasharray="4 8" strokeLinecap="round" opacity="0.5" />
            </svg>
          </motion.div>
          <motion.div
            className="absolute"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r="60" fill="none" stroke="#B8A7D6" strokeWidth="2" strokeDasharray="18 60" strokeLinecap="round" opacity="0.6" />
            </svg>
          </motion.div>
          {/* Glow behind logo */}
          <div className="absolute w-28 h-28 rounded-full opacity-30"
               style={{ background: 'radial-gradient(circle, #C7B5E8 0%, transparent 70%)', filter: 'blur(16px)' }} />
          <div className="absolute">
            <MindMoriLogo size={88} />
          </div>
        </div>

        {/* Brand text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
        >
          {/* Decorative leaf divider */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-warmgray-light text-sm opacity-50">🌿</span>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-lavender-pale to-transparent" />
            <span className="text-warmgray-light text-sm opacity-50">🌿</span>
          </div>

          <h1 className="font-serif text-4xl font-semibold tracking-wide mb-1"
              style={{ color: '#7B62A8' }}>
            MindMori AI
          </h1>
          <p className="font-serif text-lg tracking-widest mb-2"
             style={{ color: '#9B88BF', letterSpacing: '0.25em' }}>
            森　智　守　護
          </p>

          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-lavender-pale" />
            <span className="text-warmgray-light text-xs tracking-widest">阿茲海默症初步健康風險篩檢平台</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-lavender-pale" />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.8, 0] }}
          transition={{ delay: 1, duration: 2.2, times: [0, 0.2, 0.8, 1] }}
        >
          <p className="text-warmgray-light text-sm font-serif italic"
             style={{ color: '#9B88BF' }}>
            以溫和的方式，陪伴每一次健康探索。
          </p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#C7B5E8' }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
