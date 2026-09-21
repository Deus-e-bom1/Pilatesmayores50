# Desafío de Pilates en Casa — Vercel

Este é o funil de quiz standalone para subir no GitHub e conectar na Vercel.

## Como publicar

1. Baixe o arquivo `desafio-pilates-vercel.zip` e descompacte.
2. Crie um repositório no GitHub (pode ser privado).
3. Faça upload dos arquivos descompactados para a raiz do repositório.
4. No painel da Vercel, clique em **Add New Project** → **Import Git Repository** e escolha o repositório.
5. A Vercel detecta o Vite automaticamente. Confirme:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Clique em **Deploy**.

## Configurações opcionais (variáveis de ambiente)

No painel da Vercel, em **Settings → Environment Variables**, você pode adicionar:

- `VITE_META_PIXEL_ID` — ID do Pixel do Facebook/Meta
- `VITE_GA4_ID` — ID do Google Analytics 4
- `VITE_TIKTOK_PIXEL_ID` — ID do TikTok Pixel
- `VITE_VSL_MODE` — `script` (padrão), `iframe` ou `none`
- `VITE_VSL_SCRIPT_URL` — URL do script do player VTurb
- `VITE_VSL_CONTAINER_ID` — ID do container VTurb
- `VITE_CHECKOUT_URL` — link de checkout (padrão: Hotmart)
- `VITE_USE_OWN_CTA` — `true` para mostrar o botão do site, `false` para escondê-lo
- `VITE_CTA_DELAY_SECONDS` — segundos até aparecer o botão (padrão: 210 = 3:30)

## Importante

- O botão de checkout só aparece após `VITE_CTA_DELAY_SECONDS` (padrão 3 min 30 s).
- Os scripts da Utmify (pixel e UTMs) já estão em todas as páginas.
- Para as vendas aparecerem na Utmify, configure também o webhook de vendas da Hotmart no painel da Utmify.
