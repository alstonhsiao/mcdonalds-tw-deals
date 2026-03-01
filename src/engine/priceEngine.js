const CALORIE_THRESHOLDS = {
  medium: 800,
  high: 1200
};

function toInt(value) {
  const num = Number(value);
  return Number.isFinite(num) ? Math.round(num) : 0;
}

function getSinglePrice(item) {
  return item?.prices?.single;
}

function getComboPrice(item) {
  return item?.prices?.combo;
}

function hasTag(item, tag) {
  return Array.isArray(item.tags) && item.tags.includes(tag);
}

function cloneUnits(units) {
  return units.map((unit) => ({ ...unit }));
}

function takeHighestPriced(units) {
  if (!units.length) return null;
  let bestIndex = 0;
  let bestPrice = getSinglePrice(units[0].item);

  for (let i = 1; i < units.length; i += 1) {
    const price = getSinglePrice(units[i].item);
    if (price > bestPrice) {
      bestPrice = price;
      bestIndex = i;
    }
  }

  return units.splice(bestIndex, 1)[0];
}

function groupByItem(units) {
  const map = new Map();
  for (const unit of units) {
    const item = unit.item;
    const entry = map.get(item.id) || { item, qty: 0 };
    entry.qty += 1;
    map.set(item.id, entry);
  }
  return [...map.values()];
}

function detailLine(item, qty, prefix) {
  const single = getSinglePrice(item);
  const qtyPrefix = qty > 1 ? `${qty}x ` : "";
  return `${prefix}${qtyPrefix}${item.name} NT$${single}`;
}

function calculateCalories(units) {
  return units.reduce((sum, unit) => sum + toInt(unit.item.calories), 0);
}

function getCalorieLabel(totalCalories) {
  if (totalCalories >= CALORIE_THRESHOLDS.high) {
    return { label: "熱量偏高", level: "high" };
  }
  if (totalCalories >= CALORIE_THRESHOLDS.medium) {
    return { label: "熱量適中", level: "medium" };
  }
  return { label: "熱量較低", level: "low" };
}

function planAllSingle(units) {
  const grouped = groupByItem(units);
  const total = grouped.reduce((sum, g) => sum + getSinglePrice(g.item) * g.qty, 0);
  const details = grouped.map((g) => detailLine(g.item, g.qty, "單點: "));
  return {
    id: "plan-a",
    name: "方案A：全部單點",
    description: "所有品項都使用單點價格",
    total,
    details
  };
}

function planComboFirst(units, comboRule) {
  const mains = cloneUnits(units.filter((u) => u.item.type === "main"));
  const sides = cloneUnits(units.filter((u) => u.item.type === "side"));
  const drinks = cloneUnits(units.filter((u) => u.item.type === "drink"));
  const desserts = cloneUnits(units.filter((u) => u.item.type === "dessert"));

  const sideBase = comboRule?.reward?.sideBasePrice ?? 37;
  const drinkBase = comboRule?.reward?.drinkBasePrice ?? 33;
  const minSavings = comboRule?.reward?.minSavings ?? 1;

  mains.sort((a, b) => {
    const aSaving = (getSinglePrice(a.item) + sideBase + drinkBase) - toInt(getComboPrice(a.item));
    const bSaving = (getSinglePrice(b.item) + sideBase + drinkBase) - toInt(getComboPrice(b.item));
    return bSaving - aSaving;
  });

  const details = [];
  let total = 0;

  for (const mainUnit of mains) {
    const main = mainUnit.item;
    const single = getSinglePrice(main);
    const combo = getComboPrice(main);
    const hasSideOrDrinkRequested = sides.length > 0 || drinks.length > 0;

    const saving = combo != null ? (single + sideBase + drinkBase) - combo : 0;
    const canUseCombo = combo != null && hasSideOrDrinkRequested && saving >= minSavings;

    if (canUseCombo) {
      total += combo;
      details.push(`套餐: ${main.name} NT$${combo}`);

      const sideUnit = takeHighestPriced(sides);
      if (sideUnit) {
        const sidePrice = getSinglePrice(sideUnit.item);
        if (sidePrice > sideBase) {
          const diff = sidePrice - sideBase;
          total += diff;
          details.push(`  升級配餐: ${sideUnit.item.name} +NT$${diff}`);
        }
      }

      const drinkUnit = takeHighestPriced(drinks);
      if (drinkUnit) {
        const drinkPrice = getSinglePrice(drinkUnit.item);
        if (drinkPrice > drinkBase) {
          const diff = drinkPrice - drinkBase;
          total += diff;
          details.push(`  升級飲料: ${drinkUnit.item.name} +NT$${diff}`);
        }
      }
    } else {
      total += single;
      details.push(`單點主餐: ${main.name} NT$${single}`);
    }
  }

  const remaining = [...sides, ...drinks, ...desserts];
  const groupedRemaining = groupByItem(remaining);
  for (const entry of groupedRemaining) {
    total += getSinglePrice(entry.item) * entry.qty;
    details.push(detailLine(entry.item, entry.qty, "單點加購: "));
  }

  return {
    id: "plan-b",
    name: "方案B：儘量用套餐",
    description: "主餐優先改走套餐，再處理升級差額",
    total,
    details
  };
}

function planSweetheart(units, sweetheartRule) {
  const mains = cloneUnits(units.filter((u) => hasTag(u.item, sweetheartRule?.conditions?.aTag || "sweetheart_a")));
  const sides = cloneUnits(units.filter((u) => u.item.type === "side"));
  const drinks = cloneUnits(units.filter((u) => u.item.type === "drink"));
  const desserts = cloneUnits(units.filter((u) => u.item.type === "dessert"));

  const bTag = sweetheartRule?.conditions?.bTag || "sweetheart_b";

  let total = 0;
  const details = [];

  for (const mainUnit of mains) {
    const main = mainUnit.item;
    const single = getSinglePrice(main);
    total += single;
    details.push(`A區主餐: ${main.name} NT$${single}`);

    const candidates = [
      ...sides.filter((u) => hasTag(u.item, bTag)),
      ...drinks.filter((u) => hasTag(u.item, bTag)),
      ...desserts.filter((u) => hasTag(u.item, bTag))
    ];

    if (!candidates.length) continue;

    const best = candidates.reduce((prev, curr) => {
      const prevPrice = getSinglePrice(prev.item);
      const currPrice = getSinglePrice(curr.item);
      return currPrice > prevPrice ? curr : prev;
    });

    const pools = [sides, drinks, desserts];
    for (const pool of pools) {
      const idx = pool.findIndex((x) => x.item.id === best.item.id);
      if (idx !== -1) {
        pool.splice(idx, 1);
        break;
      }
    }

    const original = getSinglePrice(best.item);
    const half = Math.round(original / 2);
    total += half;
    details.push(`  甜心卡半價: ${best.item.name} NT$${half} (原價 NT$${original})`);
  }

  const unmatchedMains = units.filter(
    (u) => u.item.type === "main" && !hasTag(u.item, sweetheartRule?.conditions?.aTag || "sweetheart_a")
  );
  for (const unit of unmatchedMains) {
    const single = getSinglePrice(unit.item);
    total += single;
    details.push(`單點主餐: ${unit.item.name} NT$${single}`);
  }

  const remaining = [...sides, ...drinks, ...desserts];
  const groupedRemaining = groupByItem(remaining);
  for (const entry of groupedRemaining) {
    total += getSinglePrice(entry.item) * entry.qty;
    details.push(detailLine(entry.item, entry.qty, "單點加購: "));
  }

  return {
    id: "plan-c",
    name: "方案C：甜心卡策略",
    description: "主餐搭配 B 區高價品項半價",
    total,
    details
  };
}

function planOnePlusOneWithComboRest(units, comboRule, onePlusRule) {
  const tag = onePlusRule?.conditions?.tag || "one_plus_one";
  const bundleSize = onePlusRule?.reward?.bundleSize ?? 2;
  const bundlePrice = onePlusRule?.reward?.bundlePrice ?? 50;

  const eligible = cloneUnits(units.filter((u) => hasTag(u.item, tag)));
  const nonEligible = cloneUnits(units.filter((u) => !hasTag(u.item, tag)));

  eligible.sort((a, b) => getSinglePrice(b.item) - getSinglePrice(a.item));

  let total = 0;
  const details = [];

  const pairs = Math.floor(eligible.length / bundleSize);
  for (let i = 0; i < pairs; i += 1) {
    const pair = eligible.splice(0, bundleSize);
    total += bundlePrice;
    details.push(`1+1=50: ${pair.map((u) => u.item.name).join(" + ")} NT$${bundlePrice}`);
  }

  if (eligible.length) {
    const groupedOdd = groupByItem(eligible);
    for (const entry of groupedOdd) {
      total += getSinglePrice(entry.item) * entry.qty;
      details.push(detailLine(entry.item, entry.qty, "1+1剩餘單點: "));
    }
  }

  const comboPart = planComboFirst(nonEligible, comboRule);
  total += comboPart.total;
  details.push(...comboPart.details);

  return {
    id: "plan-d",
    name: "方案D：1+1=50策略",
    description: "先配對 1+1，再把其餘品項做套餐優化",
    total,
    details
  };
}

function planMixed(bestCandidates) {
  const best = bestCandidates.reduce((prev, curr) => (curr.total < prev.total ? curr : prev));
  return {
    id: "plan-e",
    name: "方案E：綜合最佳策略",
    description: "在可用策略中選擇最低總價",
    total: best.total,
    details: [`採用策略: ${best.name}`, ...best.details.slice(0, 12)]
  };
}

function normalizeSelection(selectionInput) {
  if (Array.isArray(selectionInput)) return selectionInput;

  if (selectionInput && typeof selectionInput === "object") {
    return Object.entries(selectionInput).map(([itemId, qty]) => ({ itemId, qty }));
  }

  return [];
}

function resolveUnits(catalog, selectionInput, options = {}) {
  const selection = normalizeSelection(selectionInput);
  const mealPeriod = options.mealPeriod || "all_day";

  const units = [];
  const skipped = [];

  for (const row of selection) {
    const item = catalog.itemsById.get(row.itemId);
    const qty = Math.max(0, toInt(row.qty));
    if (!item || qty === 0) continue;

    if (!item.available) {
      skipped.push(`${item.name} 目前不可供應，已略過`);
      continue;
    }

    const inMealPeriod = item.mealPeriods.includes(mealPeriod) || item.mealPeriods.includes("all_day") || mealPeriod === "all";
    if (!inMealPeriod) {
      skipped.push(`${item.name} 不在目前時段 (${mealPeriod})，已略過`);
      continue;
    }

    if (item.status === "unverified") {
      skipped.push(`${item.name} 尚未驗證價格，已略過計算`);
      continue;
    }

    const price = getSinglePrice(item);
    if (!Number.isFinite(price)) {
      skipped.push(`${item.name} 缺少單點價格，已略過計算`);
      continue;
    }

    for (let i = 0; i < qty; i += 1) {
      units.push({ item });
    }
  }

  return { units, skipped };
}

export function calculateOrderPlans(catalog, selectionInput, options = {}) {
  const { units, skipped } = resolveUnits(catalog, selectionInput, options);
  if (!units.length) {
    return {
      plans: [],
      bestPlan: null,
      totals: {
        calories: 0,
        calorieLabel: getCalorieLabel(0)
      },
      skipped,
      groupedSelection: []
    };
  }

  const comboRule = catalog.promotionsById.get("combo-meal");
  const sweetheartRule = catalog.promotionsById.get("sweetheart-card");
  const onePlusRule = catalog.promotionsById.get("one-plus-one-50");

  const planA = planAllSingle(units);
  const planB = planComboFirst(units, comboRule);
  const planC = planSweetheart(units, sweetheartRule);
  const planD = planOnePlusOneWithComboRest(units, comboRule, onePlusRule);
  const planE = planMixed([planB, planC, planD]);

  const plans = [planA, planB, planC, planD, planE]
    .map((p) => ({ ...p, savings: Math.max(0, planA.total - p.total) }))
    .sort((a, b) => a.total - b.total);

  const bestPlan = plans[0];
  const calories = calculateCalories(units);

  return {
    plans,
    bestPlan,
    totals: {
      calories,
      calorieLabel: getCalorieLabel(calories)
    },
    skipped,
    groupedSelection: groupByItem(units)
  };
}
