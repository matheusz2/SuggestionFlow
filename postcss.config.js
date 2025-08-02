export default {
  plugins: {
    // TailwindCSS v3 - Framework CSS utility-first
    tailwindcss: {
      // Configuração específica do TailwindCSS
      config: './tailwind.config.js',
    },
    
    // Autoprefixer - Adiciona prefixos de vendor automaticamente
    autoprefixer: {
      // Configuração do Autoprefixer
      flexbox: 'no-2009', // Usa a sintaxe moderna do flexbox
      grid: 'autoplace', // Habilita autoplacement para CSS Grid
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
        'not dead',
        'not ie 11'
      ],
    },
    
    // CSSNano - Minificação e otimização (apenas em produção)
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          minifyFontValues: true,
          minifySelectors: true,
        }],
      },
    }),
  },
} 