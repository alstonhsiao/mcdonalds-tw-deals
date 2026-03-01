export function formatCurrency(value) {
  return `NT$${value}`;
}

export function renderDataStatus(stats, manifest) {
  return `
    <div class="status-grid">
      <div class="status-card"><div class="label">資料版本</div><div class="value">${manifest.menuVersion}</div></div>
      <div class="status-card"><div class="label">已驗證品項</div><div class="value">${stats.verified}</div></div>
      <div class="status-card"><div class="label">估算品項</div><div class="value">${stats.estimated}</div></div>
      <div class="status-card"><div class="label">未驗證品項</div><div class="value warning">${stats.unverified}</div></div>
      <div class="status-card"><div class="label">啟用促銷規則</div><div class="value">${stats.activePromotions}</div></div>
      <div class="status-card"><div class="label">資料更新日</div><div class="value">${manifest.lastUpdated}</div></div>
    </div>
  `;
}

export function renderItemGroups(items, quantities) {
  const groups = {
    main: "主餐",
    side: "配餐",
    drink: "飲料",
    dessert: "甜點"
  };

  return Object.entries(groups)
    .map(([type, label]) => {
      const rows = items
        .filter((item) => item.type === type)
        .map((item) => {
          const qty = quantities[item.id] || 0;
          const price = item.prices.single;
          const statusTag = item.status === "unverified"
            ? `<span class="tag warning">未驗證</span>`
            : item.status === "estimated"
              ? `<span class="tag estimate">估算</span>`
              : "";
          const disabled = item.status === "unverified" || !item.available || !Number.isFinite(price);
          const disabledTag = !item.available ? `<span class="tag danger">停售</span>` : "";

          return `
            <div class="item-row ${disabled ? "disabled" : ""}" data-item-id="${item.id}">
              <div>
                <div class="item-title">${item.name} ${statusTag} ${disabledTag}</div>
                <div class="item-meta">${item.category} | ${price != null ? formatCurrency(price) : "無價格"} | ${item.calories ?? "?"} kcal</div>
              </div>
              <div class="qty-wrap">
                <button type="button" class="qty-btn" data-action="decrease" data-item-id="${item.id}" ${disabled ? "disabled" : ""}>-</button>
                <span class="qty-value">${qty}</span>
                <button type="button" class="qty-btn" data-action="increase" data-item-id="${item.id}" ${disabled ? "disabled" : ""}>+</button>
              </div>
            </div>
          `;
        })
        .join("");

      return `
        <section class="group">
          <h3>${label}</h3>
          <div class="group-list">${rows || "<div class='empty'>無資料</div>"}</div>
        </section>
      `;
    })
    .join("");
}

export function renderSelectionSummary(groupedSelection, totals, skipped) {
  if (!groupedSelection.length) {
    return `<div class="empty">尚未選擇可計算品項</div>`;
  }

  const rows = groupedSelection
    .map((entry) => `
      <li>${entry.qty}x ${entry.item.name} (${formatCurrency(entry.item.prices.single)} / ${entry.item.calories ?? "?"} kcal)</li>
    `)
    .join("");

  const skippedHtml = skipped.length
    ? `<div class="skip-box"><strong>已略過：</strong><ul>${skipped.map((msg) => `<li>${msg}</li>`).join("")}</ul></div>`
    : "";

  return `
    <div class="summary-box">
      <ul>${rows}</ul>
      <div class="total-calories">總熱量：${totals.calories} kcal（${totals.calorieLabel.label}）</div>
      ${skippedHtml}
    </div>
  `;
}

export function renderPlans(plans) {
  if (!plans.length) {
    return `<div class="empty">目前沒有可計算方案</div>`;
  }

  const best = plans[0].total;

  return plans
    .map((plan, idx) => {
      const isBest = idx === 0;
      return `
        <article class="plan-card ${isBest ? "best" : ""}">
          <div class="plan-head">
            <h4>${plan.name}</h4>
            <div class="plan-price">${formatCurrency(plan.total)}</div>
          </div>
          <div class="plan-sub">${plan.description}</div>
          <div class="plan-sub">比單點省 ${formatCurrency(plan.savings)} ${isBest ? "| 最佳" : `| 比最佳多 ${formatCurrency(plan.total - best)}`}</div>
          <ul class="plan-details">${plan.details.map((d) => `<li>${d}</li>`).join("")}</ul>
        </article>
      `;
    })
    .join("");
}

function selectionLabel(selection, itemsById) {
  const labels = Object.entries(selection)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => `${qty}x ${itemsById.get(id)?.name || id}`);
  return labels.join(" + ");
}

export function renderRecommendations(model, itemsById) {
  if (!model.recommendations.length) {
    return `<div class="empty">沒有符合條件的推薦</div>`;
  }

  const fallbackNote = model.usedFallback
    ? `<div class="fallback-note">未找到完全符合預算/熱量的組合，以下為最接近建議。</div>`
    : "";

  const cards = model.recommendations
    .map((rec) => `
      <article class="rec-card">
        <div class="rec-head">
          <h4>#${rec.rank} ${rec.label}</h4>
          <div class="rec-price">${formatCurrency(rec.bestPrice)}</div>
        </div>
        <div class="rec-sub">${rec.bestPlanName}</div>
        <div class="rec-sub">${rec.calories} kcal（${rec.calorieLabel.label}）</div>
        <div class="rec-sub">內容：${selectionLabel(rec.selection, itemsById)}</div>
        <ul class="rec-details">${rec.planSummary.map((line) => `<li>${line}</li>`).join("")}</ul>
      </article>
    `)
    .join("");

  return `${fallbackNote}${cards}`;
}
