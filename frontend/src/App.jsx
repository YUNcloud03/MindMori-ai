import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LoadingPage from './pages/LoadingPage'
import IntroPage from './pages/IntroPage'
import TermsPage from './pages/TermsPage'
import QuestionnairePage from './pages/QuestionnairePage'
import ResultPage from './pages/ResultPage'

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

// Shared brand logo component used across pages
export function MindMoriLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C7B5E8" />
          <stop offset="100%" stopColor="#8F76BC" />
        </linearGradient>
        <linearGradient id="brainGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B8A7D6" />
          <stop offset="100%" stopColor="#7B62A8" />
        </linearGradient>
      </defs>
      <path d="M48 6L82 20v30c0 20-16 34-34 40C14 84 14 70 14 50V20Z"
        fill="url(#shieldGrad2)" opacity="0.2" stroke="url(#shieldGrad2)" strokeWidth="2.5" />
      <path d="M48 12L76 24v26c0 17-13 28-28 34C20 78 20 67 20 50V24Z"
        fill="white" opacity="0.35" />
      <ellipse cx="40" cy="40" rx="11" ry="9" fill="url(#brainGrad2)" opacity="0.9" />
      <ellipse cx="56" cy="40" rx="11" ry="9" fill="url(#brainGrad2)" opacity="0.9" />
      <line x1="48" y1="31" x2="48" y2="49" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <circle cx="37" cy="37" r="3" fill="white" opacity="0.35" />
      <circle cx="59" cy="37" r="3" fill="white" opacity="0.35" />
      <ellipse cx="48" cy="60" rx="13" ry="6" fill="#B8A7D6" opacity="0.85" />
      <rect x="44.5" y="60" width="7" height="11" rx="3.5" fill="#EFE8F7" />
      <path d="M32 65 Q26 60 28 54 Q31 62 32 65Z" fill="#B7C3B0" opacity="0.8" />
      <path d="M64 65 Q70 60 68 54 Q65 62 64 65Z" fill="#B7C3B0" opacity="0.8" />
    </svg>
  )
}

export default function App() {
  const [page, setPage] = useState('loading')
  const [nickname, setNickname] = useState('')
  const [result, setResult] = useState(null)
  const [answers, setAnswers] = useState(null)
  const [elderMode, setElderMode] = useState(false)

  const go = (p) => setPage(p)

  return (
    <div className={`min-h-screen ${elderMode ? 'elder-mode' : ''}`}
         style={{ background: 'linear-gradient(135deg, #FAF8F3 0%, #EFE8F7 50%, #F4F1EC 100%)' }}>

      {/* Top bar — brand + elder mode toggle (visible after loading) */}
      {page !== 'loading' && (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between"
             style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(184,167,214,0.15)' }}>
          {/* Brand */}
          <div className="flex items-center gap-3">
            <MindMoriLogo size={34} />
            <div>
              <span className="font-serif text-base font-semibold" style={{ color: '#7B62A8' }}>MindMori AI</span>
              <span className="hidden sm:inline text-warmgray-light text-xs ml-2">森智守護</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Large text toggle */}
            <button
              onClick={() => setElderMode(e => !e)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-chip text-xs font-medium transition-all duration-300
                ${elderMode ? 'text-white' : 'text-warmgray-DEFAULT hover:text-lavender-DEFAULT'}
                glass-card`}
              style={elderMode ? { background: 'linear-gradient(135deg,#8F76BC,#B8A7D6)', border: 'none' } : {}}
            >
              <span className="text-sm">AA</span>
              <span>大字模式</span>
            </button>

            {/* Elder friendly toggle */}
            <button
              onClick={() => setElderMode(e => !e)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-chip text-xs font-medium transition-all duration-300 glass-card
                ${elderMode ? 'text-white' : 'text-warmgray-DEFAULT'}`}
              style={elderMode ? { background: 'linear-gradient(135deg,#8F76BC,#B8A7D6)', border: 'none' } : {}}
            >
              <span>💗</span>
              <span>長輩友善模式</span>
              <span className={`w-7 h-4 rounded-chip relative inline-block transition-colors duration-300 ${elderMode ? 'bg-white/30' : 'bg-warmgray-light/30'}`}>
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all duration-300 ${elderMode ? 'left-3.5' : 'left-0.5'}`} />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Page content — padded below fixed header */}
      <div className={page !== 'loading' ? 'pt-16' : ''}>
        <AnimatePresence mode="wait">
          {page === 'loading' && (
            <motion.div key="loading" {...pageVariants}>
              <LoadingPage onDone={() => go('intro')} />
            </motion.div>
          )}
          {page === 'intro' && (
            <motion.div key="intro" {...pageVariants}>
              <IntroPage onNext={() => go('terms')} elderMode={elderMode} />
            </motion.div>
          )}
          {page === 'terms' && (
            <motion.div key="terms" {...pageVariants}>
              <TermsPage onNext={() => go('questionnaire')} elderMode={elderMode} />
            </motion.div>
          )}
          {page === 'questionnaire' && (
            <motion.div key="questionnaire" {...pageVariants}>
              <QuestionnairePage
                elderMode={elderMode}
                onComplete={(res, ans, nick) => {
                  setResult(res)
                  setAnswers(ans)
                  setNickname(nick)
                  go('result')
                }}
              />
            </motion.div>
          )}
          {page === 'result' && (
            <motion.div key="result" {...pageVariants}>
              <ResultPage
                result={result}
                answers={answers}
                nickname={nickname}
                elderMode={elderMode}
                onRestart={() => { setResult(null); setAnswers(null); go('intro') }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
