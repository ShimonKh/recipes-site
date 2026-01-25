/**
 * Детерминированный рандомайзер на основе недели года
 * Гарантирует, что в течение одной недели будут показываться одни и те же рецепты
 */

/**
 * Получает номер недели года (ISO week number)
 */
export function getWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Простой детерминированный генератор случайных чисел на основе seed
 */
function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/**
 * Выбирает случайные элементы из массива на основе seed
 */
export function selectRandomItems<T>(items: T[], count: number, seed: number): T[] {
  if (items.length === 0 || count <= 0) return [];
  if (items.length <= count) return [...items];

  const random = seededRandom(seed);
  const selected: T[] = [];
  const available = [...items];

  for (let i = 0; i < count && available.length > 0; i++) {
    const index = Math.floor(random() * available.length);
    selected.push(available[index]);
    available.splice(index, 1);
  }

  return selected;
}

/**
 * Выбирает рецепты из разных категорий (по одному из каждой)
 * Исключает указанные категории
 */
export function selectRecipesFromDifferentCategories<T extends { category: string }>(
  items: T[],
  count: number,
  seed: number,
  excludedCategories: string[] = []
): T[] {
  if (items.length === 0 || count <= 0) return [];

  // Фильтруем рецепты, исключая указанные категории
  const filtered = items.filter(item => !excludedCategories.includes(item.category));

  // Группируем рецепты по категориям
  const byCategory = new Map<string, T[]>();
  filtered.forEach(item => {
    const category = item.category;
    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }
    byCategory.get(category)!.push(item);
  });

  // Получаем список категорий
  const categories = Array.from(byCategory.keys());
  
  if (categories.length === 0) return [];
  if (categories.length < count) {
    // Если категорий меньше, чем нужно, возвращаем по одному из каждой
    const result: T[] = [];
    categories.forEach(category => {
      const recipes = byCategory.get(category)!;
      if (recipes.length > 0) {
        result.push(recipes[0]);
      }
    });
    return result;
  }

  // Выбираем случайные категории
  const random = seededRandom(seed);
  const selectedCategories: string[] = [];
  const availableCategories = [...categories];

  for (let i = 0; i < count && availableCategories.length > 0; i++) {
    const index = Math.floor(random() * availableCategories.length);
    const category = availableCategories[index];
    selectedCategories.push(category);
    availableCategories.splice(index, 1);
  }

  // Выбираем по одному рецепту из каждой выбранной категории
  const result: T[] = [];
  selectedCategories.forEach((category, index) => {
    const recipes = byCategory.get(category)!;
    if (recipes.length > 0) {
      // Используем дополнительный seed для выбора внутри категории
      const categorySeed = seed + index * 100;
      const categoryRandom = seededRandom(categorySeed);
      const recipeIndex = Math.floor(categoryRandom() * recipes.length);
      result.push(recipes[recipeIndex]);
    }
  });

  return result;
}
