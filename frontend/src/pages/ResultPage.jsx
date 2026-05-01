import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Tooltip, Legend
} from 'recharts'
import { recommendations } from '../utils/recommendations'

const riskConfig = {
  low:    { label: '低風險', color: '#7FA878', bg: 'rgba(168,194,160,0.12)', border: 'rgba(168,194,160,0.4)', emoji: '🌿', text: '您目前的健康指標顯示認知風險較低。繼續保持良好的生活習慣，定期關注自身健康狀況。' },
  medium: { label: '中風險', color: '#C49A3C', bg: 'rgba(217,182,130,0.14)', border: 'rgba(217,182,130,0.45)', emoji: '⚡', text: '您的部分健康指標值得關注。建議諮詢醫師，進行定期健康追蹤與認知評估。' },
  high:   { label: '高風險', color: '#A76060', bg: 'rgba(167,96,96,0.10)',   border: 'rgba(167,96,96,0.35)',  emoji: '⚠️', text: '您的健康指標顯示較高的認知風險。強烈建議儘快諮詢神經內科醫師進行專業評估。' },
}

const domainLabels = {
  memory:       '記憶力',
  executive:    '執行力',
  language:     '語言能力',
  attention:    '注意力',
  daily_living: '生活功能',
}

// Circular gauge
function RiskGauge({ percentage, level }) {
  const cfg = riskConfig[level]
  const r = 80
  const circ = 2 * Math.PI * r
  const dash = (percentage / 100) * circ * 0.75

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: 210, height: 210 }}>
      <svg width="210" height="210" viewBox="0 0 210 210" style={{ transform: 'rotate(135deg)' }}>
        <circle cx="105" cy="105" r={r} fill="none" stroke="#EFE8F7" strokeWidth="13"
          strokeDasharray={`${circ * 0.75} ${circ}`} strokeLinecap="round" />
        <motion.circle cx="105" cy="105" r={r} fill="none"
          stroke={cfg.color} strokeWidth="13" strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} />
      </svg>
      <div className="absolute text-center">
        <motion.div className="font-serif font-bold text-5xl"
          style={{ color: cfg.color }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}>
          {percentage}%
        </motion.div>
        <div className="text-warmgray-light text-xs mt-1">風險機率</div>
      </div>
    </div>
  )
}

// Card detail modal
function CardModal({ card, onClose }) {
  if (!card) return null
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ background: 'rgba(107,91,142,0.25)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        className="w-full max-w-sm rounded-[28px] p-8 relative"
        style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.97),rgba(239,232,247,0.95))', boxShadow: '0 24px 60px rgba(107,91,142,0.2)', border: '1px solid rgba(184,167,214,0.4)' }}
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-warmgray-light hover:text-warmgray-DEFAULT transition-colors"
          style={{ background: 'rgba(184,167,214,0.15)' }}>
          ✕
        </button>
        {/* Content */}
        <div className="text-4xl mb-4 text-center">{card.icon}</div>
        <h3 className="font-serif font-semibold text-xl text-center mb-4" style={{ color: '#6B5B8E' }}>
          {card.title}
        </h3>
        <div className="h-px mb-4" style={{ background: 'rgba(184,167,214,0.2)' }} />
        <p className="text-warmgray-mid leading-relaxed text-sm text-center">
          {card.desc}
        </p>
        <button onClick={onClose}
          className="mt-6 w-full py-3 rounded-[20px] text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg,#8F76BC,#B8A7D6)' }}>
          收起
        </button>
      </motion.div>
    </motion.div>
  )
}

// Health card — flip animation + modal for full content
function HealthCard({ card, index, flipped, onFlip, onOpenModal }) {
  return (
    <motion.div
      className="cursor-pointer"
      style={{ perspective: 900, height: 160 }}
      onClick={() => flipped ? onOpenModal(card) : onFlip(index)}
      whileHover={{ y: -3 }}
    >
      <motion.div
        style={{ transformStyle: 'preserve-3d', height: '100%', position: 'relative' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Back — mushroom */}
        <div className="absolute inset-0 rounded-[20px] flex flex-col items-center justify-center gap-2"
             style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(135deg,rgba(239,232,247,0.9),rgba(255,255,255,0.85))', border: '1px solid rgba(184,167,214,0.3)', boxShadow: '0 8px 24px rgba(122,109,143,0.08)' }}>
          <span className="text-3xl">🍄</span>
          <p className="text-xs text-warmgray-light text-center px-3 leading-relaxed">
            點擊翻開<br />獲得建議
          </p>
        </div>
        {/* Front — summary + tap to expand */}
        <div className="absolute inset-0 rounded-[20px] flex flex-col"
             style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
               background: 'linear-gradient(135deg,rgba(255,255,255,0.95),rgba(239,232,247,0.85))',
               border: '1px solid rgba(184,167,214,0.35)', boxShadow: '0 8px 24px rgba(122,109,143,0.1)' }}>
          {/* Header */}
          <div className="flex items-center gap-2 px-4 pt-4 pb-2 flex-shrink-0"
               style={{ borderBottom: '1px solid rgba(184,167,214,0.15)' }}>
            <span className="text-lg">{card.icon}</span>
            <p className="font-semibold text-xs flex-1 truncate" style={{ color: '#6B5B8E' }}>{card.title}</p>
          </div>
          {/* Body — 2 lines preview */}
          <div className="flex-1 px-4 py-2 overflow-hidden">
            <p className="text-warmgray-mid leading-snug"
               style={{ fontSize: '0.67rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {card.desc}
            </p>
          </div>
          {/* Tap to read more */}
          <div className="px-4 pb-3 flex-shrink-0">
            <span className="text-xs font-medium" style={{ color: '#9B88BF' }}>
              點擊查看完整建議 →
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Custom radar legend
function RadarLegend() {
  return (
    <div className="flex items-center gap-6 justify-center mt-3">
      <div className="flex items-center gap-2">
        <div className="w-5 h-0.5 rounded" style={{ background: '#8F76BC' }} />
        <span className="text-xs text-warmgray-mid">您的評分</span>
      </div>
      <div className="flex items-center gap-2">
        <svg width="20" height="4">
          <line x1="0" y1="2" x2="20" y2="2" stroke="#B0A6BC" strokeWidth="1.5" strokeDasharray="4 3" />
        </svg>
        <span className="text-xs text-warmgray-light">大眾平均</span>
      </div>
    </div>
  )
}

export default function ResultPage({ result, answers, nickname, elderMode, onRestart }) {
  const [flippedCards, setFlippedCards] = useState([])
  const [modalCard, setModalCard] = useState(null)

  if (!result) return null

  const { risk_percentage, risk_level, risk_label_zh, radar_scores, recommendation_tier } = result
  const cfg = riskConfig[risk_level]
  const cards = recommendations[recommendation_tier]

  const radarData = [
    { domain: '記憶力',   score: radar_scores.memory,       avg: radar_scores.avg_memory },
    { domain: '執行力',   score: radar_scores.executive,    avg: radar_scores.avg_executive },
    { domain: '語言能力', score: radar_scores.language,     avg: radar_scores.avg_language },
    { domain: '注意力',   score: radar_scores.attention,    avg: radar_scores.avg_attention },
    { domain: '生活功能', score: radar_scores.daily_living, avg: radar_scores.avg_daily_living },
  ]

  const toggleCard = (i) => setFlippedCards(prev =>
    prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
  )
  const openModal = (card) => setModalCard(card)
  const closeModal = () => setModalCard(null)

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="glass-card px-6 py-4 mb-5 flex items-center justify-between">
          <div>
            <span className="font-serif text-sm font-semibold" style={{ color: '#7B62A8' }}>MindMori AI 森智守護</span>
            <p className="text-xs text-warmgray-light mt-0.5">大腦健康評估報告</p>
          </div>
          <button onClick={onRestart}
            className="text-xs text-warmgray-light hover:text-lavender-DEFAULT transition-colors px-4 py-2 rounded-chip"
            style={{ border: '1px solid rgba(176,166,188,0.3)' }}>
            重新評估
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-5">

          {/* LEFT */}
          <div className="space-y-5">

            {/* Risk result */}
            <motion.div className="glass-card p-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col md:flex-row items-center gap-7">
                <RiskGauge percentage={risk_percentage} level={risk_level} />
                <div className="flex-1 text-center md:text-left">
                  <p className="text-warmgray-light text-sm mb-3">
                    {nickname}，您的初步阿茲海默症風險評估結果：
                  </p>
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-chip mb-4"
                       style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
                    <span className="text-2xl">{cfg.emoji}</span>
                    <span className="font-serif font-bold text-2xl" style={{ color: cfg.color }}>
                      {risk_label_zh}
                    </span>
                  </div>
                  <p className={`text-warmgray-mid leading-relaxed ${elderMode ? 'text-base' : 'text-sm'}`}>
                    {cfg.text}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Radar chart */}
            <motion.div className="glass-card p-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className={`font-serif font-medium text-warmgray-DEFAULT ${elderMode ? 'text-xl' : 'text-lg'}`}>
                    大腦健康報告（預覽）
                  </h3>
                  <p className="text-xs text-warmgray-light mt-0.5">五大認知能力面向分析</p>
                </div>
                <span className="text-xs text-warmgray-light px-3 py-1 rounded-chip"
                      style={{ background: 'rgba(239,232,247,0.7)' }}>
                  ℹ️ 依據問卷作答推算
                </span>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="#EFE8F7" />
                  <PolarAngleAxis dataKey="domain"
                    tick={{ fill: '#837C8D', fontSize: elderMode ? 13 : 11, fontFamily: 'Noto Sans TC' }} />
                  <Radar name="您的評分" dataKey="score"
                    stroke="#8F76BC" fill="#8F76BC" fillOpacity={0.22} strokeWidth={2.5} />
                  <Radar name="全體平均" dataKey="avg"
                    stroke="#B0A6BC" fill="rgba(176,166,188,0.08)" strokeDasharray="5 4" strokeWidth={2} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(255,255,255,0.95)', borderRadius: 14, border: '1px solid #EFE8F7', fontSize: 12, fontFamily: 'Noto Sans TC' }}
                    formatter={(val, name) => [`${val} 分`, name]} />
                </RadarChart>
              </ResponsiveContainer>
              <RadarLegend />
            </motion.div>

            {/* Disclaimer */}
            <motion.div className="glass-card p-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ borderColor: 'rgba(167,96,96,0.12)' }}>
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <p className="text-xs text-warmgray-mid leading-relaxed">
                  <strong style={{ color: '#A76060' }}>重要聲明：</strong>
                  本系統僅供初步健康風險篩檢參考，不作為醫療診斷、治療或處方依據。
                  本評估結果基於統計模型推算，可能存在誤差。若有任何健康疑慮，請儘速諮詢神經內科或相關專業醫療人員。
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">

            {/* Medical navigation */}
            <motion.div className="glass-card p-6"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: '#9B88BF' }}>📍 就醫導航</p>
              <p className="text-sm text-warmgray-DEFAULT mb-4 leading-relaxed">
                如有疑慮，建議諮詢專業醫療人員。
              </p>
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl text-sm text-warmgray-DEFAULT"
                     style={{ background: 'rgba(239,232,247,0.6)' }}>
                  🏥 神經內科 / 老年醫學科
                </div>
                <div className="p-3 rounded-2xl text-sm text-warmgray-DEFAULT"
                     style={{ background: 'rgba(239,232,247,0.6)' }}>
                  📞 長照專線：1966
                </div>
              </div>
              <button className="btn-primary w-full py-3 mt-4 text-sm">
                查看下一步建議 →
              </button>
            </motion.div>

            {/* Health flip cards */}
            <motion.div className="glass-card p-6"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span>🍄</span>
                  <p className="text-xs font-medium tracking-widest uppercase" style={{ color: '#9B88BF' }}>蘑菇森林建議卡</p>
                </div>
                <span className="text-xs text-warmgray-light px-2 py-1 rounded-chip"
                      style={{ background: 'rgba(239,232,247,0.7)' }}>
                  今日可抽取 1 張
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {cards.map((card, i) => (
                  <HealthCard key={i} card={card} index={i}
                    flipped={flippedCards.includes(i)} onFlip={toggleCard} onOpenModal={openModal} />
                ))}
              </div>

              <p className="text-xs text-warmgray-light mt-4 text-center leading-relaxed">
                抽一張卡片，獲得專屬您的<br/>森林小語與健康建議。
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Card detail modal */}
      <AnimatePresence>
        {modalCard && <CardModal card={modalCard} onClose={closeModal} />}
      </AnimatePresence>
    </div>
  )
}
