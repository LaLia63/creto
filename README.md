# Creto

Creto is a modern digital business card and link-profile app. Creators can sign up, shape a live profile with one of 20 SVG-led styles, add up to five social links, publish a stable public URL, and download its QR code as a JPEG.

## Stack

- Next.js, React, TypeScript, Tailwind CSS
- Supabase Auth, Postgres, and Row Level Security
- Remotion Player for the home-page product demo
- Phosphor Icons and `qrcode`

## Local setup

1. Copy `.env.example` to `.env.local` and add the Supabase project URL and publishable key.
2. Run `npm install` and `npm run dev`.
3. Apply the migration in `supabase/migrations` to a Supabase project.

Never expose a Supabase secret or service-role key in browser code.
