import { calculateOrderPlans } from "./priceEngine.js";

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function isCalculable(item) {
  return item.available && item.status !== "unverified" && Number.isFinite(item?.prices?.single);
}

function inMealPeriod(item, mealPeriod) {
  if (mealPeriod === "all") return true;
  return item.mealPeriods.includes(mealPeriod) || item.mealPeriods.includes("all_day");
}

function addCandidate(candidates, selection, label) {
  const normalized = Object.entries(selection)
    .filter(([, qty]) => qty > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  if (!normalized.length) return;

  const key = normalized.map(([id, qty]) => `${id}:${qty}`).join("|");
  if (candidates.has(key)) return;
  candidates.set(key, { selection, label });
}

function buildAutoCandidates(catalog, mealPeriod) {
  const items = catalog.items.filter((item) => isCalculable(item) && inMealPeriod(item, mealPeriod));
  const mains = items.filter((item) => item.type === "main");
  const sides = items.filter((item) => item.type === "side");
  const drinks = items.filter((item) => item.type === "drink");
  const desserts = items.filter((item) => item.type === "dessert");

  mains.sort((a, b) => a.prices.single - b.prices.single);
  sides.sort((a, b) => a.prices.single - b.prices.single);
  drinks.sort((a, b) => a.prices.single - b.prices.single);

  const lowCalSide = [...sides].sort((a, b) => (a.calories ?? 9999) - (b.calories ?? 9999))[0];
  const lowCalDrink = [...drinks].sort((a, b) => (a.calories ?? 9999) - (b.calories ?? 9999))[0];
  const cheapestSide = sides[0];
  const cheapestDrink = drinks[0];
  const cheapestDessert = desserts.sort((a, b) => a.prices.single - b.prices.single)[0];

  const candidates = new Map();

  for (const main of mains) {
    addCandidate(candidates, { [main.id]: 1 }, `${main.name} 單點`);

    if (cheapestSide && cheapestDrink) {
      addCandidate(
        candidates,
        { [main.id]: 1, [cheapestSide.id]: 1, [cheapestDrink.id]: 1 },
        `${main.name} + 最省配餐`
      );
    }

    if (lowCalSide && lowCalDrink) {
      addCandidate(
        candidates,
        { [main.id]: 1, [lowCalSide.id]: 1, [lowCalDrink.id]: 1 },
        `${main.name} + 低熱量搭配`
      );
    }

    if (cheapestDessert && cheapestDrink) {
      addCandidate(
        candidates,
        { [main.id]: 1, [cheapestDessert.id]: 1, [cheapestDrink.id]: 1 },
        `${main.name} + 小點心`
      );
    }
  }

  return [...candidates.values()];
}

function scoreCandidate(candidate, allCandidates) {
  const prices = allCandidates.map((c) => c.bestPrice);
  const calories = allCandidates.map((c) => c.calories);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minCal = Math.min(...calories);
  const maxCal = Math.max(...calories);

  const priceNorm = maxPrice === minPrice ? 0 : (candidate.bestPrice - minPrice) / (maxPrice - minPrice);
  const calNorm = maxCal === minCal ? 0 : (candidate.calories - minCal) / (maxCal - minCal);

  return (priceNorm * 0.55) + (calNorm * 0.45);
}

export function recommendOrders(catalog, options = {}) {
  const mealPeriod = options.mealPeriod || "all_day";
  const goal = options.goal || "balanced";
  const budget = toNumber(options.budget);
  const calorieLimit = toNumber(options.calorieLimit);

  const hasSelection = options.selection && Object.keys(options.selection).length > 0;
  const candidateInputs = hasSelection
    ? [{ selection: options.selection, label: "使用者自選" }]
    : buildAutoCandidates(catalog, mealPeriod);

  const evaluated = candidateInputs
    .map((candidate) => {
      const result = calculateOrderPlans(catalog, candidate.selection, { mealPeriod });
      if (!result.bestPlan) return null;
      return {
        label: candidate.label,
        selection: candidate.selection,
        bestPrice: result.bestPlan.total,
        bestPlanName: result.bestPlan.name,
        planSummary: result.bestPlan.details.slice(0, 6),
        calories: result.totals.calories,
        calorieLabel: result.totals.calorieLabel,
        fullResult: result
      };
    })
    .filter(Boolean);

  if (!evaluated.length) {
    return {
      recommendations: [],
      constraintsApplied: { budget, calorieLimit },
      usedFallback: false
    };
  }

  const constrained = evaluated.filter((item) => {
    const withinBudget = budget == null || item.bestPrice <= budget;
    const withinCalories = calorieLimit == null || item.calories <= calorieLimit;
    return withinBudget && withinCalories;
  });

  const list = constrained.length ? constrained : evaluated;

  list.sort((a, b) => {
    if (goal === "budget") {
      return (a.bestPrice - b.bestPrice) || (a.calories - b.calories);
    }

    if (goal === "calorie") {
      return (a.calories - b.calories) || (a.bestPrice - b.bestPrice);
    }

    const scoreA = scoreCandidate(a, list);
    const scoreB = scoreCandidate(b, list);
    return scoreA - scoreB;
  });

  const recommendations = list.slice(0, 3).map((item, index) => ({
    rank: index + 1,
    label: item.label,
    bestPrice: item.bestPrice,
    bestPlanName: item.bestPlanName,
    calories: item.calories,
    calorieLabel: item.calorieLabel,
    planSummary: item.planSummary,
    selection: item.selection,
    fullResult: item.fullResult
  }));

  return {
    recommendations,
    constraintsApplied: { budget, calorieLimit },
    usedFallback: constrained.length === 0 && (budget != null || calorieLimit != null)
  };
}
