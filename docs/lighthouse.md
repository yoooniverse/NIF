# NIF Project Development Rules & Best Practices

This document outlines the coding standards, performance optimization strategies, and best practices established to maintain high Lighthouse scores and code quality. These rules act as a guide for future development and "Vibe Coding" sessions.

## 1. Package Management
- **Strictly use `pnpm`**.
- **Forbidden**: `npm install`, `yarn add`.
- **Allowed**: `pnpm add`, `pnpm install`, `pnpm run`.

## 2. Performance Optimization (Lighthouse Core Vitals)

### 2.1. Heavy Components & 3D (LCP, TBT)
- **Lazy Loading**: Heavy components (Three.js, Maps, Recharts, Lottie) **MUST** be lazy-loaded using `next/dynamic`.
- **SSR Disable**: Set `{ ssr: false }` for client-side only visual heavy components to reduce server load and hydration cost.
- **Loading Fallback**: Always provide a lightweight `loading` component (skeleton or spinner) to prevent layout shifts.
  ```typescript
  const Earth3D = dynamic(() => import('@/components/dashboard/Earth3D'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-black/10 animate-pulse" />
  });
  ```

### 2.2. Images (LCP, CLS)
- **Next.js Image**: Always use `next/image` (`<Image />`) instead of `<img>`.
- **LCP Optimization**: The main hero image or largest image above the fold **MUST** have the `priority` property.
- **Sizing**: Specify `width` & `height` or use `fill` with a parent container to prevent Layout Shifts (CLS).
- **Formats**: Use WebP (Next.js default) or optimized formats.

### 2.3. Fonts (CLS, FCP)
- **Next/Font**: Use `next/font/google` for Google Fonts.
- **Variable Fonts**: Prefer variable fonts to reduce request count.
- **Preloading**: Ensure fonts are preloaded (default in Next.js).

## 3. Data Fetching & Backend

- **Parallel Execution**: Avoid waterfall `await` calls. Use `Promise.all` for independent data fetches.
  ```typescript
  // BAD
  const user = await getUser();
  const news = await getNews();

  // GOOD
  const [user, news] = await Promise.all([getUser(), getNews()]);
  ```
- **Server Components**: Prefer fetching data in Server Components (`page.tsx`, `layout.tsx`) and passing data down.
- **Caching**: Utilize Next.js `fetch` caching or `unstable_cache` where appropriate for static/semi-static data.

## 4. Accessibility (A11y)

- **Headings**: Maintain a strictly sequential heading hierarchy (`h1` -> `h2` -> `h3`). Do not skip levels (e.g., `h1` to `h3`).
- **Interactive Elements**: All buttons and links without visible text **MUST** have an `aria-label`.
- **Images**: All images must have meaningful `alt` text. Decorative images should have `alt=""`.
- **Contrast**: Ensure sufficient color contrast for text against backgrounds (especially in Dark Mode).

## 5. SEO & Metadata

- **Metadata**: Every page (`page.tsx`) should export a `metadata` object with a unique `title` and `description`.
- **Semantic HTML**: Use semantic tags (`<main>`, `<article>`, `<section>`, `<nav>`, `<aside>`) instead of generic `<div>` soup.
- **Mobile Friendly**: Ensure viewport meta tag handles mobile devices correctly (handled by Next.js layout).

## 6. Code Architecture

- **Client vs Server**:
  - Use **Server Components** by default.
  - Add `"use client"` only when necessary (hooks, event listeners, browser APIs).
- **Component Colocation**: Keep related styles and sub-components close to where they are used.
- **Cleanup**: Remove unused imports and console logs before committing.

---

**Note**: Refer to this file before starting new features to ensure consistency and performance.
