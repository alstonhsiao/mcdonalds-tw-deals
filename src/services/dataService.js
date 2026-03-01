function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function isRuleActive(rule, dateIso = todayIso()) {
  if (!rule.enabled) return false;
  if (rule.startAt && dateIso < rule.startAt) return false;
  if (rule.endAt && dateIso > rule.endAt) return false;
  return true;
}

export async function loadCatalog() {
  const manifestRes = await fetch("./data/manifest.json");
  if (!manifestRes.ok) {
    throw new Error(`無法載入 manifest.json (${manifestRes.status})`);
  }

  const manifest = await manifestRes.json();

  const [menuRes, nutritionRes, promosRes] = await Promise.all([
    fetch(`./data/${manifest.files.menu.replace("./", "")}`),
    fetch(`./data/${manifest.files.nutrition.replace("./", "")}`),
    fetch(`./data/${manifest.files.promos.replace("./", "")}`)
  ]);

  if (!menuRes.ok || !nutritionRes.ok || !promosRes.ok) {
    throw new Error("資料檔載入失敗，請確認 data/ 版本檔是否存在");
  }

  const [menu, nutrition, promos] = await Promise.all([
    menuRes.json(),
    nutritionRes.json(),
    promosRes.json()
  ]);

  const nutritionMap = new Map(nutrition.items.map((item) => [item.id, item]));
  const items = menu.items.map((item) => {
    const nutritionRow = nutritionMap.get(item.id);
    return {
      ...item,
      calories: nutritionRow?.calories ?? null,
      nutritionConfidence: nutritionRow?.confidence ?? null
    };
  });

  const date = todayIso();
  const activePromotions = promos.rules
    .filter((rule) => isRuleActive(rule, date))
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

  const itemsById = new Map(items.map((item) => [item.id, item]));
  const promotionsById = new Map(activePromotions.map((rule) => [rule.id, rule]));

  return {
    manifest,
    menu,
    nutrition,
    promos,
    items,
    itemsById,
    promotions: activePromotions,
    promotionsById,
    stats: {
      totalItems: items.length,
      verified: items.filter((i) => i.status === "verified").length,
      estimated: items.filter((i) => i.status === "estimated").length,
      unverified: items.filter((i) => i.status === "unverified").length,
      available: items.filter((i) => i.available).length,
      activePromotions: activePromotions.length,
      date
    }
  };
}
