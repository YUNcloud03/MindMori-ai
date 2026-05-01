import { motion } from 'framer-motion'

const features = [
  { icon: '🤖', title: '機器學習風險評估', desc: '採用 XGBoost 模型，分析 32 項健康指標，提供個人化風險機率。' },
  { icon: '🌿', title: '長輩友善設計', desc: '大字體、單題作答、清晰選項，為高齡使用者量身設計。' },
  { icon: '🧠', title: '初步篩檢，非診斷', desc: '本系統僅供健康風險參考，所有資料本地處理，不作醫療依據。' },
  { icon: '💚', title: '陪伴式健康建議', desc: '根據您的風險等級，提供個人化的健康建議與就醫指引。' },
]

export default function IntroPage({ onNext, elderMode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center shadow-brand"
                 style={{ background: 'linear-gradient(135deg, #8F76BC, #C7B5E8)' }}>
              <span className="text-2xl">🌳</span>
            </div>
            <span className="font-serif text-2xl font-semibold text-lavender-DEFAULT">MindMori AI 森智守護</span>
          </div>

          <h1 className={`font-serif font-semibold text-warmgray-DEFAULT mb-4
            ${elderMode ? 'text-4xl' : 'text-3xl md:text-4xl'}`}>
            守護您與家人的<br />
            <span style={{ color: '#8F76BC' }}>認知健康</span>
          </h1>
          <p className={`text-warmgray-mid leading-relaxed max-w-lg mx-auto
            ${elderMode ? 'text-xl' : 'text-base md:text-lg'}`}>
            阿茲海默症的早期發現，是給大腦最好的守護。<br />
            透過回答幾道簡單問題，了解您的初步風險狀況。
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{f.icon}</span>
                <div>
                  <h3 className={`font-medium text-warmgray-DEFAULT mb-1 ${elderMode ? 'text-lg' : 'text-base'}`}>
                    {f.title}
                  </h3>
                  <p className={`text-warmgray-mid leading-relaxed ${elderMode ? 'text-base' : 'text-sm'}`}>
                    {f.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer banner */}
        <motion.div
          className="glass-card p-4 mb-8 border border-alert-pale"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <p className={`text-warmgray-mid leading-relaxed ${elderMode ? 'text-base' : 'text-sm'}`}>
              <strong className="text-alert-DEFAULT">重要聲明：</strong>
              本系統僅供初步健康風險篩檢參考，不作為醫療診斷、治療或處方依據。
              若結果顯示中高風險，請諮詢神經內科或相關專業醫療人員。
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={onNext}
            className={`btn-primary px-12 inline-flex items-center gap-3 font-medium
              ${elderMode ? 'py-5 text-lg' : 'py-4 text-base'}`}
          >
            <span>開始了解我的風險</span>
            <span>→</span>
          </button>
          <p className="mt-4 text-warmgray-light text-xs">大約需要 5–8 分鐘完成評估</p>
        </motion.div>
      </div>
    </div>
  )
}
