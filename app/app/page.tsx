import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BuilderStudio } from '@/components/builder-studio';

export default async function StudioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');
  return <BuilderStudio userId={user.id} email={user.email || ''} />;
}
