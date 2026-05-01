module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender:  { DEFAULT: '#8F76BC', light: '#A48FCB', pale: '#C7B5E8' },
        mist:      { DEFAULT: '#EFE8F7', light: '#F7F2FB' },
        warmgray:  { DEFAULT: '#6F6876', mid: '#837C8D', light: '#B0A6BC' },
        ivory:     { DEFAULT: '#F4F1EC', light: '#FBFAFC', white: '#FFFDF9' },
        sage:      { DEFAULT: '#A8C2A0', light: '#BBC7B0', pale: '#DDE7D3' },
        gold:      { DEFAULT: '#D9B682', pale: '#F7EAD7', light: '#F4DCC3' },
        alert:     { DEFAULT: '#A76060', pale: '#E9D7D9', white: '#FFF7F7' },
      },
      fontFamily: {
        serif:  ['"Noto Serif TC"', '"Playfair Display"', 'Georgia', 'serif'],
        sans:   ['"Noto Sans TC"', 'Urbanist', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card:   '28px',
        btn:    '24px',
        input:  '20px',
        chip:   '999px',
      },
      boxShadow: {
        card:   '0 14px 40px rgba(122,109,143,0.08)',
        btn:    '0 18px 32px rgba(143,118,188,0.18)',
        brand:  '0 12px 24px rgba(143,118,188,0.24)',
      },
    },
  },
  plugins: [],
}
