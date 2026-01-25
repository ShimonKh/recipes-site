# Project Context: Recipes Site

## Overview

**Project Name:** recipes-site  
**Type:** Static Recipe Catalog Website  
**Language:** Russian (UI)  
**Deployment:** GitHub Pages (https://ShimonKh.github.io/recipes-site)

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | 19.1.0 |
| Language | TypeScript | 5.8.3 |
| Build Tool | Vite | 7.0.4 |
| Routing | react-router-dom | 7.7.1 |
| Styling | CSS Modules | - |
| Deployment | gh-pages | 6.3.0 |

## Project Structure

```
recipes-site/
├── public/
│   ├── recipes/                    # JSON data files for each category
│   │   ├── salads.json
│   │   ├── fish.json
│   │   ├── meat.json
│   │   ├── sides.json
│   │   ├── breakfasts.json
│   │   ├── soups.json
│   │   ├── sauces.json
│   │   ├── desserts.json
│   │   └── other.json
│   └── [icons and images]
│
├── src/
│   ├── App.tsx                     # Main app with routing
│   ├── main.tsx                    # Entry point
│   ├── App.css                     # Global styles
│   ├── index.css                   # Base styles
│   │
│   ├── components/
│   │   ├── HomePage/               # Landing page with category grid
│   │   │   ├── HomePage.tsx
│   │   │   └── HomePage.module.css
│   │   ├── CategorySelector/       # Category navigation tabs
│   │   │   ├── CategorySelector.tsx
│   │   │   └── CategorySelector.module.css
│   │   ├── RecipeList/             # List of recipes in category
│   │   │   ├── RecipeList.tsx
│   │   │   └── RecipeList.module.css
│   │   └── RecipeCard/             # Detailed recipe view
│   │       ├── RecipeCard.tsx
│   │       └── RecipeCard.module.css
│   │
│   └── data/
│       ├── types.ts                # TypeScript interfaces
│       ├── categories.ts           # Category definitions
│       └── categoryEmojis.ts       # Emoji icons for categories
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Data Model

### Recipe Interface

```typescript
interface Recipe {
  title: string;           // Recipe name (Russian)
  category: string;        // Category key
  ingredients: string[];   // List of ingredients with quantities
  steps: string[];         // Cooking instructions
  tips?: string[];         // Optional cooking tips
  metadata?: {
    servings?: string;     // Number of servings
    equipment?: string;    // Required cookware
    heat?: string;         // Cooking temperature/heat level
    notes?: string;        // Additional notes
  };
}
```

### Categories

| Key | Russian Name | Description |
|-----|--------------|-------------|
| salads | Салаты | Salads |
| fish | Рыбное | Fish dishes |
| meat | Мясное | Meat dishes |
| sides | Гарниры | Side dishes |
| breakfasts | Завтраки | Breakfast items |
| soups | Супы | Soups |
| sauces | Соусы | Sauces |
| desserts | Десерты | Desserts |
| other | Другое | Other recipes |

## Current Features

### Implemented ✅

1. **Home Page**
   - Hero section with title and description
   - Category grid with emoji icons
   - "Recommended recipes" section
   - How-to-use guide

2. **Category Navigation**
   - Horizontal tab-style category selector
   - Recipe count badges per category
   - URL-based routing (`/category/:category`)

3. **Recipe Display**
   - Expandable/collapsible recipe cards
   - Alphabetically sorted recipe list
   - Structured recipe view:
     - Metadata (servings, equipment, heat, notes)
     - Ingredients list
     - Step-by-step instructions
     - Optional tips section

4. **Technical**
   - HashRouter for GitHub Pages compatibility
   - Responsive design
   - Static JSON data loading

### NOT Implemented ❌

1. **Search functionality** — No way to search recipes
2. **Filtering** — Cannot filter by ingredients, time, etc.
3. **Favorites** — No way to save favorite recipes
4. **Print view** — No print-optimized layout
5. **Recipe sharing** — No share buttons

## User Flows

### Current Flow
```
Home Page → Click Category Tile → Category Page → Click Recipe Title → View Recipe Details
```

### Pain Points
- **No search**: Users must browse categories to find recipes
- **No cross-category discovery**: Related recipes not suggested
- **No ingredient-based search**: Can't search "what can I make with..."

## Content Statistics

- **Total Categories:** 9
- **Estimated Recipes:** 50-100+ across all categories
- **Content Language:** Russian
- **Recipe data format:** JSON files in `/public/recipes/`

## Development Commands

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run deploy    # Deploy to GitHub Pages
npm run lint      # Run ESLint
```

---

*Document created: 2026-01-25*  
*Last updated: 2026-01-25*
