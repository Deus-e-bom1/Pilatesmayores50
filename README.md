# Desafío de Pilates en Casa — Funil

Site estático (React + Vite) pronto para a Vercel.

## Subir para o GitHub

1. Crie um repositório novo (vazio) no GitHub.
2. Descompacte este ZIP, abra a pasta e rode:

```bash
git init
git add .
git commit -m "funil pilates"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

## Conectar na Vercel

1. Vercel → Add New → Project → importe o repositório.
2. Framework: **Vite** (detectado automaticamente).
   Build Command: `npm run build` · Output Directory: `dist`.
3. Deploy. Não precisa de nenhuma variável de ambiente.

## Variáveis opcionais (Project → Settings → Environment Variables)

- `VITE_CHECKOUT_URL` — link de checkout (padrão: o link Hotmart atual)
- `VITE_META_PIXEL_ID`, `VITE_GA4_ID`, `VITE_TIKTOK_PIXEL_ID`
- `VITE_USE_OWN_CTA` — `false` esconde o botão do site e deixa o CTA do player

O player da VTurb e os scripts da Utmify já estão no código e carregam sozinhos.

## Rodar local

```bash
npm install
npm run dev
```
