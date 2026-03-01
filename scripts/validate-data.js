#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function pushIssue(list, level, message) {
  list.push({ level, message });
}

function validate() {
  const issues = [];
  const root = process.cwd();
  const manifestPath = path.join(root, "data", "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    pushIssue(issues, "error", "找不到 data/manifest.json");
    return issues;
  }

  const manifest = readJson(manifestPath);

  const menuPath = path.join(root, "data", manifest.files.menu.replace("./", ""));
  const nutritionPath = path.join(root, "data", manifest.files.nutrition.replace("./", ""));
  const promosPath = path.join(root, "data", manifest.files.promos.replace("./", ""));

  [menuPath, nutritionPath, promosPath].forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      pushIssue(issues, "error", `缺少資料檔：${path.relative(root, filePath)}`);
    }
  });

  if (issues.some((i) => i.level === "error")) return issues;

  const menu = readJson(menuPath);
  const nutrition = readJson(nutritionPath);
  const promos = readJson(promosPath);

  if (!Array.isArray(menu.items) || menu.items.length === 0) {
    pushIssue(issues, "error", "menu.items 為空");
    return issues;
  }

  const idSet = new Set();
  for (const item of menu.items) {
    if (!item.id) {
      pushIssue(issues, "error", "發現缺少 id 的品項");
      continue;
    }

    if (idSet.has(item.id)) {
      pushIssue(issues, "error", `重複 item id：${item.id}`);
      continue;
    }
    idSet.add(item.id);

    if (!item.type || !["main", "side", "drink", "dessert"].includes(item.type)) {
      pushIssue(issues, "error", `${item.id} 類型錯誤：${item.type}`);
    }

    if (!Array.isArray(item.mealPeriods) || item.mealPeriods.length === 0) {
      pushIssue(issues, "error", `${item.id} 缺少 mealPeriods`);
    }

    if (!item.prices || typeof item.prices !== "object") {
      pushIssue(issues, "error", `${item.id} 缺少 prices`);
      continue;
    }

    const calculable = item.status === "verified" || item.status === "estimated";
    if (calculable && !isFiniteNumber(item.prices.single)) {
      pushIssue(issues, "error", `${item.id} status=${item.status} 但 single 價格不是有效數字`);
    }

    if (item.type === "main" && calculable && item.prices.combo != null && !isFiniteNumber(item.prices.combo)) {
      pushIssue(issues, "error", `${item.id} combo 不是有效數字`);
    }

    if (!item.available && item.status !== "unverified" && item.note == null) {
      pushIssue(issues, "warn", `${item.id} 已標記不可供應，建議填入 note`);
    }
  }

  const nutritionMap = new Map((nutrition.items || []).map((row) => [row.id, row]));
  for (const item of menu.items) {
    if (item.status === "unverified") continue;
    if (!nutritionMap.has(item.id)) {
      pushIssue(issues, "warn", `${item.id} 缺少 nutrition 對應`);
    }
  }

  const allowedRuleTypes = new Set(["combo_bundle", "pair_discount", "fixed_bundle"]);
  if (!Array.isArray(promos.rules) || promos.rules.length === 0) {
    pushIssue(issues, "error", "promos.rules 為空");
  } else {
    for (const rule of promos.rules) {
      if (!rule.id) pushIssue(issues, "error", "促銷規則缺少 id");
      if (!allowedRuleTypes.has(rule.type)) {
        pushIssue(issues, "error", `促銷規則 ${rule.id} type 不支援：${rule.type}`);
      }
      if (!rule.startAt || !rule.endAt) {
        pushIssue(issues, "error", `促銷規則 ${rule.id} 缺少 startAt/endAt`);
      } else if (rule.startAt > rule.endAt) {
        pushIssue(issues, "error", `促銷規則 ${rule.id} 日期範圍錯誤`);
      }
    }
  }

  return issues;
}

function main() {
  const issues = validate();
  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");

  console.log("資料驗證結果");
  console.log(`- error: ${errors.length}`);
  console.log(`- warn: ${warns.length}`);

  for (const issue of issues) {
    const prefix = issue.level === "error" ? "[ERROR]" : "[WARN]";
    console.log(`${prefix} ${issue.message}`);
  }

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

main();
