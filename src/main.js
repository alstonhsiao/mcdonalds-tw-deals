import { loadCatalog } from "./services/dataService.js";
import { calculateOrderPlans } from "./engine/priceEngine.js";
import { recommendOrders } from "./engine/recommendEngine.js";
import {
  renderDataStatus,
  renderItemGroups,
  renderSelectionSummary,
  renderPlans,
  renderRecommendations
} from "./ui/render.js";

const state = {
  catalog: null,
  mealPeriod: "all_day",
  quantities: {}
};

function toSelectionObject() {
  return Object.fromEntries(
    Object.entries(state.quantities)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, qty]) => [itemId, qty])
  );
}

function inMealPeriod(item) {
  if (state.mealPeriod === "all") return true;
  return item.mealPeriods.includes(state.mealPeriod) || item.mealPeriods.includes("all_day");
}

function visibleItems() {
  return state.catalog.items.filter(inMealPeriod);
}

function renderPromotions() {
  const promoCards = document.getElementById("promoCards");
  if (!promoCards) return;

  promoCards.innerHTML = state.catalog.promos.cards
    .map((card) => `
      <article class="promo-card">
        <h4>${card.title}</h4>
        <p>${card.summary}</p>
        <div class="promo-date">更新：${card.updatedAt}</div>
      </article>
    `)
    .join("");
}

function renderAll() {
  const { catalog } = state;

  document.getElementById("dataStatus").innerHTML = renderDataStatus(catalog.stats, catalog.manifest);
  document.getElementById("itemPicker").innerHTML = renderItemGroups(visibleItems(), state.quantities);
  renderPromotions();
}

function changeQty(itemId, delta) {
  const next = Math.max(0, (state.quantities[itemId] || 0) + delta);
  if (next === 0) {
    delete state.quantities[itemId];
  } else {
    state.quantities[itemId] = next;
  }
  document.getElementById("itemPicker").innerHTML = renderItemGroups(visibleItems(), state.quantities);
}

function runCalculation() {
  const selection = toSelectionObject();
  const result = calculateOrderPlans(state.catalog, selection, { mealPeriod: state.mealPeriod });

  document.getElementById("selectionSummary").innerHTML = renderSelectionSummary(
    result.groupedSelection,
    result.totals,
    result.skipped
  );
  document.getElementById("planResults").innerHTML = renderPlans(result.plans);
}

function runRecommendation() {
  const budget = document.getElementById("budgetInput").value;
  const calorieLimit = document.getElementById("calorieInput").value;
  const goal = document.getElementById("goalSelect").value;

  const selection = toSelectionObject();

  const rec = recommendOrders(state.catalog, {
    selection,
    mealPeriod: state.mealPeriod,
    budget,
    calorieLimit,
    goal
  });

  document.getElementById("recommendationResults").innerHTML = renderRecommendations(rec, state.catalog.itemsById);
}

function bindEvents() {
  document.getElementById("mealPeriod").addEventListener("change", (event) => {
    state.mealPeriod = event.target.value;
    document.getElementById("itemPicker").innerHTML = renderItemGroups(visibleItems(), state.quantities);
  });

  document.getElementById("itemPicker").addEventListener("click", (event) => {
    const action = event.target.getAttribute("data-action");
    const itemId = event.target.getAttribute("data-item-id");
    if (!action || !itemId) return;
    changeQty(itemId, action === "increase" ? 1 : -1);
  });

  document.getElementById("calcBtn").addEventListener("click", runCalculation);
  document.getElementById("recommendBtn").addEventListener("click", runRecommendation);

  document.getElementById("clearBtn").addEventListener("click", () => {
    state.quantities = {};
    document.getElementById("itemPicker").innerHTML = renderItemGroups(visibleItems(), state.quantities);
    document.getElementById("selectionSummary").innerHTML = "";
    document.getElementById("planResults").innerHTML = "";
    document.getElementById("recommendationResults").innerHTML = "";
  });
}

async function bootstrap() {
  try {
    state.catalog = await loadCatalog();
    bindEvents();
    renderAll();
  } catch (error) {
    document.getElementById("app").innerHTML = `
      <div class="error-box">
        <h2>載入失敗</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
}

bootstrap();
