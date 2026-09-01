import 'server-only';

export type PublicReview = {
  id: string;
  body: string;
  rating: number;
  name: string;
  role: string;
};

type ReviewRow = {
  id: string;
  user_id: string;
  body: string;
  rating: number;
};

type ProfileRow = {
  user_id: string;
  name: string;
  bio: string;
};

const restHeaders = {
  apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''}`,
};

export async function getApprovedReviews(): Promise<PublicReview[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl || !restHeaders.apikey) return [];

  try {
    const reviewsUrl = new URL('/rest/v1/creto_reviews', baseUrl);
    reviewsUrl.searchParams.set('select', 'id,user_id,body,rating');
    reviewsUrl.searchParams.set('approved', 'eq.true');
    reviewsUrl.searchParams.set('order', 'created_at.desc');
    reviewsUrl.searchParams.set('limit', '12');

    const reviewsResponse = await fetch(reviewsUrl, {
      headers: restHeaders,
      next: { revalidate: 60 },
    });
    if (!reviewsResponse.ok) return [];

    const reviews = await reviewsResponse.json() as ReviewRow[];
    if (reviews.length === 0) return [];

    const userIds = [...new Set(reviews.map((review) => review.user_id))];
    const profilesUrl = new URL('/rest/v1/creto_profiles', baseUrl);
    profilesUrl.searchParams.set('select', 'user_id,name,bio');
    profilesUrl.searchParams.set('published', 'eq.true');
    profilesUrl.searchParams.set('user_id', `in.(${userIds.join(',')})`);

    const profilesResponse = await fetch(profilesUrl, {
      headers: restHeaders,
      next: { revalidate: 60 },
    });
    const profiles = profilesResponse.ok
      ? await profilesResponse.json() as ProfileRow[]
      : [];
    const profilesByUser = new Map(profiles.map((profile) => [profile.user_id, profile]));

    return reviews.map((review) => {
      const profile = profilesByUser.get(review.user_id);
      return {
        id: review.id,
        body: review.body,
        rating: review.rating,
        name: profile?.name.trim() || 'Creto member',
        role: profile?.bio.trim() || 'Community review',
      };
    });
  } catch {
    return [];
  }
}
