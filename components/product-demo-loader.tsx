'use client';

import dynamic from 'next/dynamic';

const ProductDemo = dynamic(
  () => import('@/components/product-demo').then((module) => module.ProductDemo),
  {
    ssr: false,
    loading: () => <div className="aspect-[8/5] animate-pulse rounded-[2rem] bg-[#3A0519]" aria-label="Loading product demo" />,
  },
);

export function ProductDemoLoader() {
  return <ProductDemo />;
}
