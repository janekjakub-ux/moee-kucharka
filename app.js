/* Moje Kuchařka — statická verze (bez buildu, funguje přímo na GitHub Pages) */
(function () {
  "use strict";

  var CATEGORIES = ["Hlavní chody", "Přílohy", "Polévky", "Předkrmy a saláty", "Dezerty"];
  var CUISINES = ["Česká", "Italská", "Světová"];
  var FALLBACK_IMAGE = "images/placeholder-recipe.jpg";
  var STORAGE_KEY = "pwa_kucharka_recipes";
  var LIBRARY_KEY = "pwa_kucharka_library_v1";

  var DEFAULT_RECIPES =
[
  {
    id: "1",
    title: "Svíčková na smetaně",
    category: "Hlavní chody",
    time: 150,
    baseServings: 4,
    image: "images/svickova.jpg",
    ingredients: [
      "700g hovězí zadní",
      "200g kořenová zelenina (mrkev, celer, petržel)",
      "1x cibule",
      "250ml smetana ke šlehání",
      "100g špek",
      "divoké koření (nové koření, pepř, bobkový list)",
      "citrón",
      "brusinky",
    ],
    instructions:
      "1. Hovězí maso prošpikujeme klínky špeku, osolíme a opepříme.\n2. Na rozpaleném tuku orestujeme nakrájenou kořenovou zeleninu a cibulku do zlatova.\n3. Přidáme maso, opečeme ze všech stran, přidáme divoké koření a podlijeme vodou nebo vývarem.\n4. Dusíme doměkka (cca 2 hodiny).\n5. Maso vyjmeme, koření odstraníme, zeleninový základ rozmixujeme, zahustíme smetanou a dochutíme citrónovou šťávou.\n6. Podáváme s houskovým knedlíkem a brusinkami.",
  },
  {
    id: "2",
    title: "Hovězí guláš",
    category: "Hlavní chody",
    time: 120,
    baseServings: 4,
    image: "images/gulas.jpg",
    ingredients: [
      "600g hovězí kližka",
      "500g cibule",
      "3 lžíce mletá sladká paprika",
      "2 stroužky česnek",
      "majoránka",
      "sůl",
      "pepř",
      "sádlo",
    ],
    instructions:
      "1. Na sádle osmažíme velkorysé množství cibule zcela do tmavooranžova.\n2. Přidáme nakrájené hovězí maso, zprudka opečeme, zasypeme sladkou paprikou a krátce zarestujeme.\n3. Podlijeme trochou vody, osolíme, opepříme a pod pokličkou dusíme do změknutí (cca 1,5–2 hodiny).\n4. Nakonec dochutíme třeným česnekem a rozetřenou majoránkou. Podáváme s houskovým knedlíkem nebo chlebem.",
  },
  {
    id: "3",
    title: "Křupavé Bramboráky",
    category: "Přílohy",
    time: 35,
    baseServings: 4,
    image: "images/bramboraky.jpg",
    ingredients: [
      "1000g brambory (typ B/C)",
      "2x vejce",
      "4 stroužky česneku",
      "100ml mléko",
      "3 lžíce hladká mouka",
      "hodně majoránky",
      "sůl, pepř",
      "sádlo na smažení",
    ],
    instructions:
      "1. Brambory oloupeme a nastrouháme najemno (případně napůl nahrubo).\n2. Vytlačíme přebytečnou vodu a zalijeme horkým mlékem, aby brambory nezčernaly.\n3. Přidáme vejce, prolisovaný česnek, mouku, sůl, pepř a pořádnou dávku majoránky.\n4. Na pánvi na rozpáleném sádle smažíme tenké placky z obou stran dozlatova a dokřupava.",
  },
  {
    id: "4",
    title: "Vepřo knedlo zelo",
    category: "Hlavní chody",
    time: 110,
    baseServings: 4,
    image: "images/veprozelo.jpg",
    ingredients: [
      "800g vepřová krkovice nebo bůček",
      "500g kysané zelí",
      "1x cibule",
      "kmín",
      "česnek",
      "sůl",
      "hladká mouka na zahuštění",
    ],
    instructions:
      "1. Vepřové maso nakrájíme na větší kostky, osolíme, opepříme, promačkáme s česnekem a kmínem.\n2. Dáme do pekáče s nakrájenou cibulí, podlijeme trochou vody a pečeme při 180°C cca 1.5 hodiny do změknutí a výpeku.\n3. Kysané zelí podlijeme vodou, přidáme kmín a podusíme. Nakonec lehce zahustíme jíškou.\n4. Podáváme s bramborovým nebo houskovým knedlíkem.",
  },
  {
    id: "5",
    title: "Tradiční bábovka",
    category: "Dezerty",
    time: 60,
    baseServings: 4,
    image: "images/babovka.jpg",
    ingredients: [
      "2x hrnek polohrubá mouka",
      "1x hrnek cukr krupice",
      "1x hrnek mléko",
      "0.5 hrnku olej",
      "3x vejce",
      "1x prášek do pečiva",
      "2 lžíce kakao",
    ],
    instructions:
      "1. Žloutky utřeme s cukrem a olejem, přidáme mléko a mouku smíchanou s kypřicím práškem.\n2. Z bílků ušleháme tuhý sníh a zlehka ho zapracujeme do těsta.\n3. Dvě třetiny těsta nalijeme do vymazané a vysypané bábovkové formy.\n4. Do zbylé třetiny přimícháme kakao a nalijeme na světlé těsto.\n5. Pečeme v předehřáté troubě na 180°C přibližně 45 minut.",
  },
];

  var LIBRARY = (window.RECIPES_LIBRARY || []).map(function (r) {
    return Object.assign({}, r, { image: FALLBACK_IMAGE });
  });
  var ALL_DEFAULTS = DEFAULT_RECIPES.map(function (r) {
    return Object.assign({}, r, { cuisine: "Česká" });
  }).concat(LIBRARY);

  /* ---------- Úložiště (localStorage) ---------- */
  function saveRecipes(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }

  function loadRecipes() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    var list = ALL_DEFAULTS;
    if (saved) {
      try {
        var parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) list = parsed;
      } catch (e) { /* ignore */ }
    }
    var libSeen = null;
    try { libSeen = localStorage.getItem(LIBRARY_KEY); } catch (e) { /* ignore */ }
    if (saved && !libSeen) {
      var ids = {};
      list.forEach(function (r) { ids[r.id] = true; });
      list = list.concat(LIBRARY.filter(function (r) { return !ids[r.id]; }));
      saveRecipes(list);
    }
    try { localStorage.setItem(LIBRARY_KEY, "1"); } catch (e) { /* ignore */ }
    var libIds = {};
    LIBRARY.forEach(function (r) { libIds[r.id] = true; });
    return list.map(function (r) {
      // Dříve uložené cesty k obrázkům ze starší verze nahradíme aktuálními
      if (r.id.indexOf("-") !== -1 && libIds[r.id]) return Object.assign({}, r, { image: FALLBACK_IMAGE });
      var def = DEFAULT_RECIPES.filter(function (d) { return d.id === r.id; })[0];
      if (def && (!r.image || /^\/?assets\//.test(r.image))) return Object.assign({}, r, { image: def.image });
      return r;
    });
  }

  /* ---------- Pomocné funkce ---------- */
  function scaleIngredient(text, ratio) {
    if (ratio === 1) return text;
    return text.replace(/(\d+(?:[.,]\d+)?)/g, function (match) {
      var num = parseFloat(match.replace(",", "."));
      if (isNaN(num)) return match;
      var scaled = num * ratio;
      var rounded = scaled % 1 === 0 ? scaled : parseFloat(scaled.toFixed(1));
      return String(rounded).replace(".", ",");
    });
  }

  function servingsLabel(count) {
    if (count === 1) return "porce";
    return count < 5 ? "porce" : "porcí";
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ---------- Stav ---------- */
  var state = {
    recipes: loadRecipes(),
    view: "list",
    search: "",
    category: "vse",
    cuisine: "vse",
    selectedId: null,
    servings: 4,
    checked: {},
    form: null
  };

  var EMPTY_FORM = { id: "", title: "", category: "Hlavní chody", time: "", image: "", ingredients: "", instructions: "" };
  var app = document.getElementById("app");

  function persist(next) {
    state.recipes = next;
    saveRecipes(next);
  }

  function selected() {
    return state.recipes.filter(function (r) { return r.id === state.selectedId; })[0] || null;
  }

  function filtered() {
    var q = state.search.toLowerCase();
    return state.recipes.filter(function (r) {
      var okCat = state.category === "vse" || r.category === state.category;
      var okCui = state.cuisine === "vse" || r.cuisine === state.cuisine;
      var okSearch =
        r.title.toLowerCase().indexOf(q) !== -1 ||
        r.ingredients.some(function (i) { return i.toLowerCase().indexOf(q) !== -1; });
      return okCat && okCui && okSearch;
    });
  }

  function go(view) {
    state.view = view;
    render();
    window.scrollTo(0, 0);
  }

  function openDetail(id) {
    var r = state.recipes.filter(function (x) { return x.id === id; })[0];
    if (!r) return;
    state.selectedId = id;
    state.servings = r.baseServings || 4;
    state.checked = {};
    go("detail");
  }

  function openForm(recipe) {
    state.form = recipe
      ? {
          id: recipe.id,
          title: recipe.title,
          category: recipe.category || "Hlavní chody",
          time: String(recipe.time),
          image: recipe.image && recipe.image.indexOf("images/") !== 0 ? recipe.image : "",
          ingredients: recipe.ingredients.join(", "),
          instructions: recipe.instructions
        }
      : Object.assign({}, EMPTY_FORM);
    go("form");
  }

  /* ---------- Vykreslení ---------- */
  function headerHtml() {
    return '<header class="header"><h1>🍳 Moje Kuchařka</h1>' +
      '<button class="btn-add" data-action="add">+ Přidat recept</button></header>';
  }

  function listHtml() {
    var items = filtered();
    var cuisines = ["vse"].concat(CUISINES).map(function (c) {
      return '<button class="chip' + (state.cuisine === c ? " on-accent" : "") + '" data-cuisine="' + esc(c) + '">' +
        (c === "vse" ? "Všechny kuchyně" : esc(c) + " kuchyně") + "</button>";
    }).join("");
    var cats = ["vse"].concat(CATEGORIES).map(function (c) {
      return '<button class="chip' + (state.category === c ? " on-primary" : "") + '" data-category="' + esc(c) + '">' +
        (c === "vse" ? "Všechny" : esc(c)) + "</button>";
    }).join("");
    var cards = items.length === 0
      ? '<div class="empty"><p class="big">🔍</p><p>Nenalezeny žádné recepty podle zadaných kritérií.</p></div>'
      : items.map(function (r) {
          return '<button class="card" data-open="' + esc(r.id) + '">' +
            '<img src="' + esc(r.image || FALLBACK_IMAGE) + '" alt="' + esc(r.title) + '" loading="lazy" data-img>' +
            '<div class="card-body"><div class="card-top"><h3 class="card-title">' + esc(r.title) + "</h3>" +
            '<span class="badge">' + esc(r.category || "Recept") + "</span></div>" +
            '<div class="meta"><span>⏱️ ' + esc(r.time) + " minut</span><span>🥗 " + r.ingredients.length + " ingrediencí</span></div>" +
            "</div></button>";
        }).join("");
    return "<main>" +
      '<div class="search-wrap"><input id="search" class="input" placeholder="Hledat podle názvu nebo ingrediencí..." value="' + esc(state.search) + '"></div>' +
      '<div class="chips">' + cuisines + "</div>" +
      '<p class="count" id="count">Nalezeno receptů: ' + items.length + "</p>" +
      '<div class="chips last">' + cats + "</div>" +
      '<div class="list" id="list">' + cards + "</div></main>";
  }

  function detailHtml() {
    var s = selected();
    if (!s) return "";
    var ratio = state.servings / (s.baseServings || 4);
    var ings = s.ingredients.map(function (ing, i) {
      return "<li>" +
        '<input id="ing-' + i + '" type="checkbox" data-check="' + i + '"' + (state.checked[i] ? " checked" : "") + ">" +
        '<label for="ing-' + i + '"' + (state.checked[i] ? ' class="done"' : "") + ">" + esc(scaleIngredient(ing, ratio)) + "</label></li>";
    }).join("");
    return "<main>" +
      '<div class="hero"><img src="' + esc(s.image || FALLBACK_IMAGE) + '" alt="' + esc(s.title) + '" data-img>' +
      '<button class="btn-back" data-action="back">← Zpět</button></div>' +
      '<div class="detail"><h2>' + esc(s.title) + "</h2>" +
      '<div class="row"><span class="badge">' + esc(s.category || "Recept") + '</span><span class="t">⏱️ ' + esc(s.time) + " min</span></div>" +
      '<div class="servings"><span>👥 Počet porcí / lidí:</span><div class="stepper">' +
      '<button class="round" data-action="minus">−</button>' +
      '<span class="val">' + state.servings + " " + servingsLabel(state.servings) + "</span>" +
      '<button class="round" data-action="plus">+</button></div></div>' +
      '<h3 class="h3">Ingredience</h3><ul class="ings">' + ings + "</ul>" +
      '<h3 class="h3">Postup přípravy</h3><p class="steps">' + esc(s.instructions) + "</p>" +
      '<div class="actions"><button class="btn-primary" data-action="edit">✏️ Upravit recept</button>' +
      '<button class="btn-danger" data-action="delete">🗑️</button></div></div></main>';
  }

  function formHtml() {
    var f = state.form;
    var catOpts = CATEGORIES.map(function (c) {
      return '<option value="' + esc(c) + '"' + (f.category === c ? " selected" : "") + ">" + esc(c) + "</option>";
    }).join("");
    return '<main class="form-wrap"><h2>' + (f.id ? "Upravit recept" : "Přidat nový recept") + "</h2>" +
      '<form id="recipe-form">' +
      '<label class="field"><span>Název receptu *</span><input class="input" name="title" required placeholder="např. Svíčková na smetaně" value="' + esc(f.title) + '"></label>' +
      '<label class="field"><span>Kategorie</span><select class="input" name="category">' + catOpts + "</select></label>" +
      '<label class="field"><span>Doba přípravy (v minutách) *</span><input class="input" name="time" type="number" required placeholder="60" value="' + esc(f.time) + '"></label>' +
      '<label class="field"><span>URL adresa obrázku (volitelné)</span><input class="input" name="image" type="url" placeholder="https://..." value="' + esc(f.image) + '"></label>' +
      '<label class="field"><span>Ingredience pro 4 porce (oddělené čárkou) *</span><textarea class="input min-24" name="ingredients" required placeholder="700g hovězí maso, 1x cibule, 250ml smetana...">' + esc(f.ingredients) + "</textarea></label>" +
      '<label class="field"><span>Postup vaření *</span><textarea class="input min-36" name="instructions" required placeholder="1. Maso orestujeme na cibulce...&#10;2. Přidáme koření a podlijeme...">' + esc(f.instructions) + "</textarea></label>" +
      '<div class="form-actions"><button type="button" class="btn-secondary" data-action="cancel">Zrušit</button>' +
      '<button type="submit" class="btn-primary">Uložit recept</button></div></form></main>';
  }

  function render() {
    var body = state.view === "list" ? listHtml() : state.view === "detail" ? detailHtml() : formHtml();
    app.innerHTML = headerHtml() + body;
  }

  // Jen překreslí seznam (aby při psaní do hledání nemizel kurzor)
  function renderListOnly() {
    var tmp = document.createElement("div");
    tmp.innerHTML = listHtml();
    document.getElementById("list").innerHTML = tmp.querySelector("#list").innerHTML;
    document.getElementById("count").textContent = tmp.querySelector("#count").textContent;
  }

  /* ---------- Události ---------- */
  app.addEventListener("click", function (e) {
    var t = e.target.closest("[data-action],[data-open],[data-cuisine],[data-category]");
    if (!t) return;
    if (t.dataset.open) return openDetail(t.dataset.open);
    if (t.dataset.cuisine) { state.cuisine = t.dataset.cuisine; return render(); }
    if (t.dataset.category) { state.category = t.dataset.category; return render(); }
    var a = t.dataset.action;
    if (a === "add") openForm();
    else if (a === "back") go("list");
    else if (a === "edit") openForm(selected());
    else if (a === "cancel") go(state.selectedId && state.form && state.form.id ? "detail" : "list");
    else if (a === "minus") { state.servings = Math.max(1, state.servings - 1); render(); }
    else if (a === "plus") { state.servings = Math.min(20, state.servings + 1); render(); }
    else if (a === "delete") {
      var s = selected();
      if (!s) return;
      if (!window.confirm("Opravdu chcete tento recept smazat?")) return;
      persist(state.recipes.filter(function (r) { return r.id !== s.id; }));
      state.selectedId = null;
      go("list");
    }
  });

  app.addEventListener("input", function (e) {
    if (e.target.id === "search") {
      state.search = e.target.value;
      renderListOnly();
    }
  });

  app.addEventListener("change", function (e) {
    if (e.target.dataset && e.target.dataset.check !== undefined) {
      state.checked[e.target.dataset.check] = e.target.checked;
      var label = e.target.parentNode.querySelector("label");
      if (label) label.className = e.target.checked ? "done" : "";
    }
  });

  app.addEventListener("submit", function (e) {
    if (e.target.id !== "recipe-form") return;
    e.preventDefault();
    var d = new FormData(e.target);
    var ingredients = String(d.get("ingredients")).split(",")
      .map(function (i) { return i.trim(); }).filter(Boolean);
    var base = {
      title: String(d.get("title")).trim(),
      category: String(d.get("category")),
      time: parseInt(d.get("time"), 10) || 0,
      image: String(d.get("image")).trim(),
      ingredients: ingredients,
      instructions: String(d.get("instructions")).trim()
    };
    var id = state.form.id;
    if (id) {
      persist(state.recipes.map(function (r) { return r.id === id ? Object.assign({}, r, base) : r; }));
      openDetail(id);
    } else {
      persist([Object.assign({ id: Date.now().toString(), baseServings: 4 }, base)].concat(state.recipes));
      go("list");
    }
  });

  // Chybějící obrázek -> záložní obrázek
  app.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG" && t.dataset.img !== undefined && t.getAttribute("src") !== FALLBACK_IMAGE) {
      t.src = FALLBACK_IMAGE;
    }
  }, true);

  render();
})();
