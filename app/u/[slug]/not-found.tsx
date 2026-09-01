import Link from 'next/link';

export default function ProfileNotFound() {
  return <main className="grid min-h-screen place-items-center px-5 text-center"><div><p className="section-kicker mx-auto">Profile unavailable</p><h1 className="mt-5 font-serif text-6xl font-bold">This link is still becoming.</h1><p className="mx-auto mt-4 max-w-md text-muted-foreground">The creator may not have published this profile yet. (ဒီ profile ကို မျှဝေရန် အဆင်သင့်မဖြစ်သေးပါ)</p><Link href="/" className="button-primary mt-7">Explore Creto</Link></div></main>;
}
