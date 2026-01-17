# NIF Design System Code Reference

This document serves as a reference for the core UI/UX patterns and design codes used across the NIF application. It allows for consistent replication of the "Vibe Coding" aesthetic in future features.

## 1. Hero Section (Landing Page)

**File Reference:** `app/page.tsx`

**Key Design Elements:**
- **Background:** `ClientSpaceBackground` + `ClientLazyEarth` (3D).
- **Typography:** `text-4xl md:text-5xl lg:text-6xl` for main headlines with `drop-shadow-2xl`.
- **Gradients:** `bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent`.
- **Animations:** Custom `fade-in-up` animation and `animate-pulse` for indicators.
- **Glassmorphism:** `backdrop-blur-md`, `bg-blue-500/20`.

```tsx
// Hero Title Example
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl px-4">
  경제뉴스가 어렵나요?
  <br />
  <span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
    가난은 더 어렵습니다
  </span>
</h1>
```

## 2. Main Dashboard

**File Reference:** `app/dashboard/page.tsx`

**Key Design Elements:**
- **Layout:** Full-screen 3D Canvas (`GlobeCanvas`) with absolute positioned UI overlay.
- **Sidebar (Glass Panel):**
  - **Classes:** `w-[92vw] md:w-[min(40vw,560px)] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_30px_100px_-70px_rgba(0,0,0,0.9)]`.
  - **Effect:** High-end glass effect with deep shadow.
- **Buttons (Cards):**
  - **Normal:** `rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition`.
  - **Boarding Pass Button:** `bg-black/20` for slightly darker contrast within the glass panel.
- **Modals:** Centered glass modals with `backdrop-blur-2xl` and `bg-black/35`.

```tsx
// Glass Sidebar Panel
<aside className="absolute right-4 top-4 bottom-4 w-[92vw] md:w-[min(40vw,560px)] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_30px_100px_-70px_rgba(0,0,0,0.9)] pointer-events-auto">
  {/* Content */}
</aside>

// Dashboard Action Button
<button className="group w-full flex-1 min-h-[96px] rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-left hover:bg-white/10 transition">
  {/* Icon + Text */}
</button>
```

## 3. Today's News Page

**File Reference:** `app/news/today/page.tsx`

**Key Design Elements:**
- **Container:** `max-w-[1100px]`, `px-6 pt-8`.
- **Navigation:** Back button with `h-12 w-12 rounded-2xl border border-white/20 bg-white/10 backdrop-blur`.
- **Category Filter:**
  - **Selected:** `bg-blue-600 text-white shadow-lg shadow-blue-900/40`.
  - **Unselected:** `bg-white/5 text-white/80 hover:bg-white/10 border border-white/10 backdrop-blur`.
- **News Card (List):** Handled by `NewsCard` component, usually consistent with dashboard aesthetic.

```tsx
// Category Filter Button
<button
  className={`px-5 py-3 rounded-full text-base font-semibold transition ${selectedCategory === category.slug
    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' // Active
    : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10 backdrop-blur' // Inactive
    }`}
>
  {category.name}
</button>
```

## 4. News Explanation (Detail) Page

**File Reference:** `app/news/[id]/page.tsx`

**Key Design Elements:**
- **Header:** White text, large bold title (`text-3xl sm:text-4xl`).
- **Boarding Pass Button:** Enhanced button with `bg-white/10` and `backdrop-blur`.
- **Title Card:** `rounded-3xl border border-gray-200 bg-white px-7 py-6 shadow-lg` (High contrast white card against dark background).
- **Tags:** Blue pill tags `px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full`.
- **Content Blocks:** Uses specific components (`NewsSummary`, `WorstScenario`, `ActionItem`) which follow the `rounded-2xl` and `bg-white/5` or `bg-white` pattern depending on context.

```tsx
// White Title Card (Distinct from Dark Mode Background)
<div className="rounded-3xl border border-gray-200 bg-white px-7 py-6 shadow-lg">
  <div className="flex items-center gap-2 mb-3">
    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
      {news.category}
    </span>
  </div>
  <h2 className="text-2xl sm:text-3xl font-bold text-black leading-tight">
    {news.title}
  </h2>
</div>
```

## 5. Economic Cycle Map Page

**File Reference:** `app/cycle/page.tsx`

**Key Design Elements:**
- **Theme:** "Military Economic Radar System" / "HUD" Style.
- **Colors:** Green (`text-green-400`, `border-green-400/20`), Black (`bg-[#020617]`).
- **Typography:** `font-mono` is used extensively for that technical/radar feel.
- **Modals:**
  - **Container:** `bg-[#020617] border border-green-400/20`.
  - **Scrollbar:** Custom green/black scrollbar styling.
- **Traffic Light:** Visual indicator using standard colors (Red/Yellow/Green) but with "glow" effects (`shadow-lg`).

```tsx
// Military/HUD Style Modal
<div className="w-full max-w-4xl bg-[#020617] border border-green-400/20 rounded-xl shadow-2xl backdrop-blur-md rounded-xl custom-modal-scroll">
  <h3 className="text-green-400 font-mono text-xl uppercase tracking-wider font-bold">경제 순환기 분석</h3>
  {/* ... */}
</div>

// Custom Scrollbar Global Style
<style jsx global>{`
  .custom-modal-scroll::-webkit-scrollbar { width: 8px; }
  .custom-modal-scroll::-webkit-scrollbar-thumb {
    background: #10B981;
    border: 2px solid #020617;
  }
`}</style>
```
