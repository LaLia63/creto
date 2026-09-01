export const CARD_STYLES = [
  { id: 'minimal', label: 'Minimal', note: 'Quiet precision' },
  { id: 'elegant', label: 'Elegant', note: 'Graceful serif' },
  { id: 'glass', label: 'Glass', note: 'Layered clarity' },
  { id: 'editorial', label: 'Editorial', note: 'Magazine energy' },
  { id: 'creative', label: 'Creative', note: 'Bold composition' },
  { id: 'botanical', label: 'Botanical', note: 'Organic lines' },
  { id: 'midnight', label: 'Midnight', note: 'After-dark glow' },
  { id: 'soft-rose', label: 'Soft Rose', note: 'Warm and tender' },
  { id: 'professional', label: 'Professional', note: 'Clear confidence' },
  { id: 'developer', label: 'Developer', note: 'Code-led identity' },
  { id: 'business', label: 'Business', note: 'Executive polish' },
  { id: 'mono', label: 'Mono', note: 'Pure contrast' },
  { id: 'gradient', label: 'Gradient', note: 'Fluid color' },
  { id: 'organic', label: 'Organic', note: 'Soft movement' },
  { id: 'modern', label: 'Modern', note: 'Sharp system' },
  { id: 'luxury', label: 'Luxury', note: 'Fine detail' },
  { id: 'neon', label: 'Neon', note: 'Electric edge' },
  { id: 'retro', label: 'Retro', note: 'Nostalgic rhythm' },
  { id: 'playful', label: 'Playful', note: 'Bright personality' },
  { id: 'brutalist', label: 'Brutalist', note: 'Unfiltered impact' },
] as const;

export type CardStyle = (typeof CARD_STYLES)[number]['id'];

export const SOCIAL_PLATFORMS = [
  { id: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/username' },
  { id: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
  { id: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { id: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
  { id: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
  { id: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username' },
  { id: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]['id'];

export type SocialLink = {
  id?: string;
  platform: SocialPlatform;
  url: string;
  position: number;
};

export type CretoProfile = {
  id?: string;
  user_id?: string;
  slug: string;
  name: string;
  bio: string;
  email: string;
  phone: string;
  avatar_data_url: string | null;
  card_style: CardStyle;
  theme_mode?: 'light' | 'dark';
  published?: boolean;
};

export const EMPTY_PROFILE: CretoProfile = {
  slug: 'your-name',
  name: 'Your Name',
  bio: 'Tell the world what you make, who you help, and what makes your work memorable.',
  email: '',
  phone: '',
  avatar_data_url: null,
  card_style: 'minimal',
  theme_mode: 'light',
  published: false,
};
