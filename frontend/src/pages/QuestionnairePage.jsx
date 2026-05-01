import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions, defaultAnswers } from '../utils/questions'
import { getPrediction } from '../utils/api'

// Beautiful avatar SVG for sidebar
function UserAvatar({ nickname }) {
  const initial = nickname ? nickname[0] : '友'
  const colors = ['#B8A7D6', '#A8C2A0', '#D9B682', '#C7B5E8', '#BBC7B0']
  const color = colors[nickname ? nickname.charCodeAt(0) % colors.length : 0]

  return (
    <div className="relative">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <defs>
          <linearGradient id="avatarGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#EFE8F7" />
          </linearGradient>
          <linearGradient id="avatarBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Outer ring */}
        <circle cx="36" cy="36" r="35" fill="url(#avatarGrad)" opacity="0.2" stroke={color} strokeWidth="1.5" />
        {/* Inner circle */}
        <circle cx="36" cy="36" r="30" fill="url(#avatarGrad)" opacity="0.35" />
        {/* Head */}
        <circle cx="36" cy="28" r="12" fill="url(#avatarGrad)" opacity="0.9" />
        {/* Body */}
        <ellipse cx="36" cy="54" rx="16" ry="10" fill="url(#avatarBody)" />
        {/* Hair detail */}
        <path d="M24 26 Q24 16 36 15 Q48 16 48 26" fill={color} opacity="0.7" />
        {/* Face highlight */}
        <circle cx="32" cy="26" r="2" fill="white" opacity="0.5" />
        {/* Leaf decoration */}
        <path d="M8 52 Q4 44 10 40 Q11 48 8 52Z" fill="#A8C2A0" opacity="0.7" />
        <path d="M64 52 Q68 44 62 40 Q61 48 64 52Z" fill="#A8C2A0" opacity="0.7" />
        {/* Initial text */}
        <text x="36" y="33" textAnchor="middle" dominantBaseline="middle"
          fontFamily="Noto Serif TC, serif" fontWeight="600" fontSize="14" fill="white" opacity="0.95">
          {initial}
        </text>
      </svg>
      {/* Online dot */}
      <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white"
           style={{ background: '#A8C2A0' }} />
    </div>
  )
}

// Forest progress panel
function ProgressPanel({ current, total, section, nickname }) {
  const steps = 5
  const stepSize = Math.ceil(total / steps)
  const currentStep = Math.min(steps, Math.ceil((current + 1) / stepSize))

  return (
    <div className="glass-card p-6 h-full flex flex-col gap-5 overflow-hidden">
      {/* User info */}
      <div className="flex flex-col items-center text-center gap-2 pb-4"
           style={{ borderBottom: '1px solid rgba(184,167,214,0.15)' }}>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm">📖</span>
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#9B88BF' }}>腦力存摺</span>
        </div>
        <UserAvatar nickname={nickname} />
        <div>
          <p className="text-warmgray-mid text-sm">您好，</p>
          <p className="font-serif font-medium text-lg" style={{ color: '#6B5B8E' }}>{nickname || '朋友'}</p>
        </div>
        <div className="px-4 py-1.5 rounded-chip text-xs" style={{ background: 'rgba(184,167,214,0.12)', color: '#9B88BF' }}>
          💗 持續關注，是給大腦最好的守護。
        </div>
      </div>

      {/* Forest illustration */}
      <div className="rounded-2xl relative overflow-hidden flex items-center justify-center"
           style={{ background: 'linear-gradient(160deg, #DDE7D3 0%, #EFE8F7 100%)', minHeight: 110 }}>
        {/* Layered forest scene */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 gap-0">
          {/* Background trees */}
          <div className="absolute top-2 left-2 text-2xl opacity-30">🌲</div>
          <div className="absolute top-1 right-3 text-xl opacity-25">🌲</div>
          {/* Mushrooms */}
          <div className="absolute bottom-2 left-4 text-xl opacity-70">🍄</div>
          <div className="absolute bottom-3 right-4 text-lg opacity-60">🍄</div>
          {/* Plants */}
          <div className="absolute bottom-1 left-8 text-sm opacity-80">🌿</div>
          <div className="absolute bottom-1 right-8 text-sm opacity-70">🌱</div>
        </div>
        <div className="relative z-10 text-center px-4 py-3">
          <p className="text-xs leading-relaxed font-serif italic" style={{ color: '#6B5B8E' }}>
            在蘑菇森林裡，<br />每一步探索，<br />都是守護大腦的力量。
          </p>
        </div>
      </div>

      {/* Progress steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium" style={{ color: '#9B88BF' }}>探索進度</span>
          <span className="text-xs text-warmgray-light">第 {currentStep} 步 / 共 {steps} 步</span>
        </div>
        <div className="flex items-center">
          {[...Array(steps)].map((_, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold
                flex-shrink-0 transition-all duration-400
                ${i + 1 < currentStep
                  ? 'text-white shadow-sm'
                  : i + 1 === currentStep
                    ? 'text-white shadow-brand scale-110'
                    : 'text-warmgray-light bg-white/60 border border-warmgray-light/20'}`}
                style={i + 1 <= currentStep
                  ? { background: i + 1 < currentStep
                      ? 'linear-gradient(135deg,#A8C2A0,#7FA878)'
                      : 'linear-gradient(135deg,#8F76BC,#C7B5E8)' }
                  : {}}>
                {i + 1 < currentStep ? '✓' : i + 1}
              </div>
              {i < steps - 1 && (
                <div className="flex-1 h-0.5 mx-0.5 rounded transition-colors duration-400"
                     style={{ background: i + 1 < currentStep ? '#A8C2A0' : 'rgba(176,166,188,0.2)' }} />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-warmgray-light mt-3 text-center">
          再完成 {Math.max(0, total - current - 1)} 題，即可解鎖您的大腦健康報告！
        </p>
      </div>

      {/* Current section badge */}
      <div className="rounded-2xl p-4 mt-auto" style={{ background: 'rgba(184,167,214,0.1)', border: '1px solid rgba(184,167,214,0.2)' }}>
        <p className="text-xs mb-1" style={{ color: '#9B88BF' }}>目前區段</p>
        <p className="font-medium text-warmgray-DEFAULT text-sm">{section}</p>
        <p className="text-xs text-warmgray-light mt-1">第 {current + 1} / {total} 題</p>
      </div>

      {/* Daily tip */}
      <div className="text-center">
        <p className="text-xs text-warmgray-light italic leading-relaxed font-serif">
          每天花幾鐘分關心自己，<br/>讓我們一起走得更遠、記得更久。
        </p>
      </div>
    </div>
  )
}

// Right sidebar
function SidePanel({ elderMode }) {
  return (
    <div className="glass-card p-6 h-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span>🌿</span>
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#9B88BF' }}>今日健康建議</span>
      </div>
      <p className="text-xs text-warmgray-light">依目前狀況提供下一步指引</p>

      {[
        { icon: '📖', color: '#B8A7D6', title: '多閱讀', desc: '閱讀能刺激大腦，增強記憶力。' },
        { icon: '🥗', color: '#A8C2A0', title: '地中海飲食', desc: '多攝取蔬果、橄欖油、堅果與魚類。' },
        { icon: '🚶', color: '#A8C2A0', title: '規律散步', desc: '每天30分鐘，有助大腦健康。' },
        { icon: '💚', color: '#B8A7D6', title: '與家人分享結果', desc: '讓家人了解，一起守護健康。' },
      ].map((tip, i) => (
        <motion.div key={i}
          className="flex items-center gap-3 p-3 rounded-2xl cursor-default hover:bg-mist-DEFAULT/50 transition-colors"
          whileHover={{ x: 2 }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
               style={{ background: `${tip.color}22` }}>
            {tip.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-warmgray-DEFAULT ${elderMode ? 'text-sm' : 'text-xs'}`}>{tip.title}</p>
            <p className="text-warmgray-light text-xs truncate">{tip.desc}</p>
          </div>
          <span className="text-warmgray-light/40 text-xs flex-shrink-0">›</span>
        </motion.div>
      ))}

      <div className="mt-auto p-3 rounded-2xl" style={{ background: 'rgba(167,96,96,0.06)', border: '1px solid rgba(167,96,96,0.1)' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#A76060', opacity: 0.8 }}>
          🛡️ 本系統僅供初步健康風險篩檢參考，不作為醫療診斷、治療或處方依據。
        </p>
      </div>

      <div className="p-3 rounded-2xl" style={{ background: 'rgba(143,118,188,0.06)' }}>
        <p className="text-xs text-warmgray-mid mb-1 font-medium">📍 就醫導航</p>
        <p className="text-xs text-warmgray-light">如有疑慮，建議諮詢專業醫療人員。</p>
        <button className="mt-2 w-full py-2 rounded-xl text-xs text-white font-medium"
                style={{ background: 'linear-gradient(135deg,#8F76BC,#B8A7D6)' }}>
          查看下一步建議 →
        </button>
      </div>
    </div>
  )
}

export default function QuestionnairePage({ elderMode, onComplete }) {
  const [nickname, setNickname] = useState('')
  const [nicknameSet, setNicknameSet] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({ ...defaultAnswers })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const q = questions[currentIdx]
  const total = questions.length

  const handleAnswer = (field, value) => {
    const updated = { ...answers, [field]: value }
    setAnswers(updated)
    if (q.type === 'choice') {
      setTimeout(() => advance(updated), 350)
    }
  }

  const advance = async (updated) => {
    if (currentIdx < total - 1) {
      setCurrentIdx(i => i + 1)
    } else {
      await submit(updated)
    }
  }

  const handleSliderNext = async () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(i => i + 1)
    } else {
      await submit(answers)
    }
  }

  const submit = async (finalAnswers) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getPrediction(finalAnswers)
      onComplete(result, finalAnswers, nickname)
    } catch (e) {
      setError('無法連線至伺服器，請確認後台服務是否正在運行。')
      setLoading(false)
    }
  }

  // Nickname screen
  if (!nicknameSet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
        <motion.div className="glass-card p-10 max-w-lg w-full text-center"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="flex justify-center mb-5">
            <UserAvatar nickname="" />
          </div>
          <h2 className={`font-serif font-semibold mb-2 ${elderMode ? 'text-3xl' : 'text-2xl'}`}
              style={{ color: '#6B5B8E' }}>
            您好！請輸入您的暱稱
          </h2>
          <p className="text-warmgray-light text-sm mb-7">我們將用暱稱稱呼您，讓評估過程更加親切溫暖。</p>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="例如：志明、阿嬌..."
            className={`w-full px-5 py-4 rounded-input border-2 border-lavender-pale/40
              focus:outline-none bg-white/60 text-warmgray-DEFAULT placeholder-warmgray-light mb-6
              transition-colors ${elderMode ? 'text-xl' : 'text-base'}`}
            style={{ focusBorderColor: '#8F76BC' }}
            onKeyDown={e => e.key === 'Enter' && nickname.trim() && setNicknameSet(true)}
          />
          <button
            onClick={() => setNicknameSet(true)}
            disabled={!nickname.trim()}
            className={`btn-primary w-full ${elderMode ? 'py-5 text-lg' : 'py-4'} ${!nickname.trim() ? 'opacity-40' : ''}`}
          >
            開始評估 →
          </button>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <div className="relative">
          <motion.div className="w-20 h-20 rounded-full border-4 border-lavender-pale border-t-transparent"
            style={{ borderTopColor: '#8F76BC' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
        </div>
        <div className="text-center">
          <p className="font-serif text-xl mb-1" style={{ color: '#6B5B8E' }}>正在分析您的健康資料…</p>
          <p className="text-warmgray-light text-sm">AI 模型正在計算您的風險機率</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr_240px] gap-4">

        {/* Left: Progress */}
        <div className="hidden md:block">
          <ProgressPanel current={currentIdx} total={total} section={q.section} nickname={nickname} />
        </div>

        {/* Center: Question */}
        <div className="flex flex-col gap-4">
          {/* Top bar */}
          <div className="glass-card px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-chip text-white text-xs"
                    style={{ background: 'linear-gradient(135deg,#8F76BC,#B8A7D6)' }}>
                智能評估問卷
              </span>
            </div>
            <span className="text-xs text-warmgray-light">問題 {currentIdx + 1} / {total}</span>
          </div>

          {/* Progress bar */}
          <div className="glass-card px-5 py-3">
            <div className="flex items-center justify-between text-xs text-warmgray-light mb-2">
              <span>評估進度</span>
              <span>{Math.round(((currentIdx + 1) / total) * 100)}% 完成</span>
            </div>
            <div className="h-2 rounded-chip overflow-hidden" style={{ background: '#EFE8F7' }}>
              <motion.div className="h-full rounded-chip"
                style={{ background: 'linear-gradient(90deg,#8F76BC,#C7B5E8)' }}
                animate={{ width: `${((currentIdx + 1) / total) * 100}%` }}
                transition={{ duration: 0.5 }} />
            </div>
          </div>

          {/* Question card */}
          <div className="glass-card p-7 flex-1">
            <AnimatePresence mode="wait">
              <motion.div key={currentIdx}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.32 }}>

                <span className="text-xs px-3 py-1 rounded-chip inline-block mb-3"
                      style={{ background: 'rgba(184,167,214,0.15)', color: '#9B88BF' }}>
                  {q.section}
                </span>

                <h2 className={`font-serif font-medium text-warmgray-DEFAULT mb-6 leading-relaxed
                  ${elderMode ? 'text-3xl' : 'text-2xl md:text-3xl'}`}>
                  {q.icon} {q.zh}
                </h2>

                {q.description && (
                  <p className="text-warmgray-light text-sm mb-5 px-4 py-3 rounded-2xl"
                     style={{ background: 'rgba(239,232,247,0.5)' }}>
                    💡 {q.description}
                  </p>
                )}

                {/* Choice */}
                {q.type === 'choice' && (
                  <div className={`grid gap-3 ${q.options.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
                    {q.options.map((opt, i) => (
                      <motion.button key={i}
                        className={`option-card p-5 flex flex-col items-center gap-3 text-center
                          ${answers[q.field] === opt.value ? 'selected' : ''}`}
                        onClick={() => handleAnswer(q.field, opt.value)}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}>
                        <span className="text-3xl">{opt.icon}</span>
                        <span className={`font-medium text-warmgray-DEFAULT ${elderMode ? 'text-lg' : 'text-sm'}`}>
                          {opt.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Slider */}
                {q.type === 'slider' && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <span className={`font-serif font-semibold ${elderMode ? 'text-5xl' : 'text-4xl'}`}
                            style={{ color: '#8F76BC' }}>
                        {answers[q.field]}
                      </span>
                      <span className="text-warmgray-light text-sm ml-2">{q.unit.split('（')[0]}</span>
                    </div>
                    <input type="range"
                      min={q.min} max={q.max} step={q.step}
                      value={answers[q.field]}
                      onChange={e => setAnswers(prev => ({ ...prev, [q.field]: parseFloat(e.target.value) }))}
                      className="w-full h-3 rounded-chip appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8F76BC ${((answers[q.field] - q.min) / (q.max - q.min)) * 100}%, #EFE8F7 0%)`,
                        accentColor: '#8F76BC',
                      }}
                    />
                    <div className="flex justify-between text-xs text-warmgray-light">
                      <span>{q.min}</span>
                      <span>{q.max}</span>
                    </div>
                    {q.unit.includes('（') && (
                      <p className="text-xs text-warmgray-light text-center">
                        {q.unit.match(/（(.+)）/)?.[1]}
                      </p>
                    )}
                    <button onClick={handleSliderNext}
                      className={`btn-primary w-full mt-2 ${elderMode ? 'py-5 text-lg' : 'py-4'}`}>
                      {currentIdx < total - 1 ? '下一題 →' : '完成評估 →'}
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {currentIdx > 0 && (
            <div className="text-center">
              <button onClick={() => setCurrentIdx(i => i - 1)}
                className="text-warmgray-light text-sm hover:text-lavender-DEFAULT transition-colors">
                ← 返回上一題
              </button>
            </div>
          )}

          {error && (
            <div className="glass-card p-4 border border-alert-pale text-center"
                 style={{ color: '#A76060' }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Right: Tips */}
        <div className="hidden md:block">
          <SidePanel elderMode={elderMode} />
        </div>
      </div>
    </div>
  )
}
