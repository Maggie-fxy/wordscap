import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Ethereal Warmth 配色系统
        // Background 背景体系
        bg: {
          DEFAULT: '#FFFDF5',    // 主背景 - 暖白略带米色
          secondary: '#FFFFFF',  // 次级背景 - 卡片、弹窗
          tertiary: '#F5F8FC',   // 轻区块背景 - 偏冷浅蓝白
        },
        // Text 文字体系
        text: {
          DEFAULT: '#2D2D2D',    // 主文本 - 中性深灰
          secondary: '#6B7280',  // 次级文本 - 冷灰
          muted: '#A3A9B2',      // 弱文本 - 占位符
          onPrimary: '#FFFFFF',  // 主色上的文字
        },
        // Primary 主交互色
        primary: {
          DEFAULT: '#E57373',    // 主要操作 - Salmon 温和暖红
          hover: '#DE5F5F',      // 悬停
          soft: '#FBEAEA',       // 轻主色背景
        },
        // Secondary 辅助强调
        secondary: {
          DEFAULT: '#FFD54F',    // 次级强调 - Sunflower Yellow
          soft: '#FFF4CC',       // 轻高亮
          border: '#F2C94C',     // 描边或图标
        },
        // Accent 风格强化色
        accent: {
          DEFAULT: '#8FB6E8',    // 冷平衡色
        },
        // 保留一些实用色
        success: '#80CBC4',      // 成功状态
        warning: '#FFAB91',      // 警告状态
        error: '#EF5350',        // 错误状态
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Fredoka One', 'Nunito', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'soft-md': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 24px rgba(0, 0, 0, 0.1)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-soft': 'pulse 3s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'pop': 'pop 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
