import { useState } from 'react'
import { motion } from 'framer-motion'

const termsContent = [
  {
    title: '一、服務說明',
    body: `MindMori AI 森智守護（以下簡稱「本平台」）係提供阿茲海默症初步健康風險篩檢服務。本平台使用機器學習模型（XGBoost）根據使用者輸入之健康相關資訊，計算並提供初步風險機率參考。`,
  },
  {
    title: '二、免責聲明',
    body: `本平台提供之風險評估結果，僅供初步健康風險篩檢參考，不構成醫療診斷、治療建議或處方依據。本平台之評估結果基於統計模型推算，可能存在誤差，不能取代專業醫療人員之評估與診斷。`,
  },
  {
    title: '三、資料使用說明',
    body: `使用者於本平台輸入之所有健康資訊，僅用於當次評估計算，不會被永久儲存、傳輸至第三方，或用於任何商業用途。本平台採用本地端計算方式，保護使用者隱私。`,
  },
  {
    title: '四、就醫建議',
    body: `若本平台評估結果顯示中風險或高風險，強烈建議使用者儘快諮詢神經內科、老年醫學科或相關專業醫療人員進行進一步評估。長照相關資源可撥打長照專線 1966 查詢。`,
  },
  {
    title: '五、適用對象',
    body: `本平台適用於 40 歲以上之成人使用者，或代為協助家中長輩填答之家屬。本平台不適用於已確診阿茲海默症或其他失智症之患者作為病程追蹤工具。`,
  },
  {
    title: '六、著作權聲明',
    body: `本平台所有內容，包含文字、介面設計、程式碼及機器學習模型，均受著作權法保護。未經授權，不得複製、修改或散布。`,
  },
]

const checkItems = [
  '我已詳細閱讀並了解以上所有條款內容。',
  '我同意本平台之免責聲明，了解評估結果僅供初步健康風險篩檢參考，不作為醫療診斷依據。',
  '我了解本平台所蒐集之健康資訊，僅用於當次計算，不會被儲存或傳輸至第三方。',
  '若評估結果顯示中高風險，我將主動諮詢專業醫療人員進行進一步評估。',
]

export default function TermsPage({ onNext, elderMode }) {
  const [checked, setChecked] = useState(Array(checkItems.length).fill(false))
  const [expanded, setExpanded] = useState(null)

  const allChecked = checked.every(Boolean)
  const toggle = (i) => setChecked(prev => prev.map((v, j) => j === i ? !v : v))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full">

        {/* Header */}
        <motion.div className="text-center mb-8"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-4">📜</div>
          <h1 className={`font-serif font-semibold mb-2 ${elderMode ? 'text-3xl' : 'text-2xl'}`}
              style={{ color: '#6B5B8E' }}>
            使用條款與隱私政策
          </h1>
          <p className={`text-warmgray-mid ${elderMode ? 'text-lg' : 'text-sm'}`}>
            請閱讀以下條款，使用本平台即表示您同意下列內容。
          </p>
        </motion.div>

        {/* Terms accordion */}
        <motion.div className="glass-card p-2 mb-6 max-h-72 overflow-y-auto"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {termsContent.map((term, i) => (
            <div key={i} className="border-b border-lavender-pale/20 last:border-0">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-mist-DEFAULT/40 transition-colors rounded-2xl"
              >
                <span className={`font-medium text-warmgray-DEFAULT ${elderMode ? 'text-base' : 'text-sm'}`}>
                  {term.title}
                </span>
                <motion.span
                  animate={{ rotate: expanded === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-warmgray-light text-xs flex-shrink-0 ml-2"
                >▼</motion.span>
              </button>
              {expanded === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-4"
                >
                  <p className={`text-warmgray-mid leading-relaxed ${elderMode ? 'text-base' : 'text-xs'}`}>
                    {term.body}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Checkbox agreement */}
        <motion.div className="glass-card p-7 mb-7"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className={`font-medium text-warmgray-DEFAULT mb-5 ${elderMode ? 'text-lg' : 'text-sm'}`}>
            請勾選以下所有項目以確認您已閱讀並同意：
          </p>
          <div className="space-y-4">
            {checkItems.map((item, i) => (
              <motion.label
                key={i}
                className="flex items-start gap-4 cursor-pointer group"
                whileHover={{ x: 2 }}
                onClick={() => toggle(i)}
              >
                {/* Custom checkbox */}
                <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center
                  transition-all duration-200 mt-0.5
                  ${checked[i]
                    ? 'border-transparent'
                    : 'border-warmgray-light/50 group-hover:border-lavender-pale'}`}
                  style={checked[i] ? { background: 'linear-gradient(135deg,#8F76BC,#B8A7D6)' } : {}}>
                  {checked[i] && (
                    <motion.svg
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                    >
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </div>
                <p className={`text-warmgray-DEFAULT leading-relaxed select-none ${elderMode ? 'text-base' : 'text-sm'}`}>
                  {item}
                </p>
              </motion.label>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-mist-DEFAULT rounded-chip overflow-hidden">
              <motion.div
                className="h-full rounded-chip"
                style={{ background: 'linear-gradient(90deg,#8F76BC,#C7B5E8)' }}
                animate={{ width: `${(checked.filter(Boolean).length / checkItems.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-xs text-warmgray-light flex-shrink-0">
              {checked.filter(Boolean).length} / {checkItems.length}
            </span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div className="text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <button
            onClick={onNext}
            disabled={!allChecked}
            className={`btn-primary px-12 inline-flex items-center gap-3
              ${elderMode ? 'py-5 text-lg' : 'py-4 text-base'}
              ${!allChecked ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span>我已閱讀並同意，繼續</span>
            <span>→</span>
          </button>
          {!allChecked && (
            <p className="mt-3 text-warmgray-light text-xs">
              請勾選全部 {checkItems.length} 項條款後繼續
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
