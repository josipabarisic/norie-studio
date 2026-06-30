(() => {
  // ===== content data =====
  // Work categories — replace desc/year/images with your real projects when ready.
  const projects = [
    { name: "Canva dizajni za društvene mreže", cat: "Društvene mreže", catKey: "drustvene-mreze", year: "", desc: "Vizualni sadržaj za Instagram i druge društvene mreže, izrađen u Canvi." },
    { name: "Logo dizajn", cat: "Logo dizajn", catKey: "logo", year: "", desc: "Prepoznatljivi logotipovi koji nose priču brenda." },
    { name: "Vizualni identitet", cat: "Vizualni identitet", catKey: "identitet", year: "", desc: "Cjeloviti vizualni sustavi: boje, tipografija i grafički elementi." },
    { name: "Web stranica", cat: "Web dizajn", catKey: "web", year: "", desc: "Web stranice dizajnirane s jasnoćom i svrhom." }
  ];
  const services = ["Grafički i web dizajn", "Izrada web stranica", "Vizualni identitet", "Brendiranje", "Marketing", "Copywriting"];
  const process = [
    { num: "01", title: "Upoznajem te", body: "Razgovaram s tobom o tvom poslu, priči i viziji." },
    { num: "02", title: "Tražim jasnoću", body: "Definiram što želiš reći i kako želiš da se ljudi osjećaju." },
    { num: "03", title: "Dizajniram", body: "Pretvaram ideje u identitet i web koji djeluju prirodno, lijepo i promišljeno." },
    { num: "04", title: "Lansiram", body: "Odlaziš s alatom koji ti pomaže rasti i s kojim se osjećaš povezano." }
  ];
  const principles = [
    "Slušam prije nego što dizajniram.",
    "Tražim bit, a ne trend.",
    "Stvaram s namjerom, ne iz žurbe.",
    "Vjerujem da dobar dizajn može donijeti mir i jasnoću."
  ];
  // Pricing pending — tell me your real packages/prices to replace "Cijena na upit".
  const tiers = [
    { no: "No. 1", name: "Grafički dizajn", desc: "Canva dizajni za društvene mreže, logo i ostali grafički materijali.", from: "Cijena na upit", dark: false },
    { no: "No. 2", name: "Vizualni identitet", desc: "Cjeloviti vizualni sustav za brend — boje, tipografija, grafički elementi.", from: "Cijena na upit", dark: true },
    { no: "No. 3", name: "Web stranica", desc: "Dizajn i izrada web stranice prilagođene brendu.", from: "Cijena na upit", dark: false }
  ];
  const marqueeItems = ["Grafički dizajn", "Web dizajn", "Vizualni identitet", "Brendiranje", "Marketing", "Copywriting"];
  const catLabel = { "drustvene-mreze": "Društvene mreže", logo: "Logo dizajn", identitet: "Vizualni identitet", web: "Web dizajn" };
  const forWhomText = "Za brendove koji žele više od lijepog izgleda. Za ljude koji žele stvoriti nešto što će trajati.";

  let workFilter = null;

  // ===== render: marquee =====
  function renderMarquee() {
    const el = document.getElementById("marquee");
    const row = marqueeItems.concat(marqueeItems);
    el.innerHTML = row.map(t => `<span>${t}</span>`).join("");
  }

  // ===== render: featured work (home) =====
  function renderFeaturedWork() {
    const el = document.getElementById("featured-work");
    const featured = projects.slice(0, 3);
    el.innerHTML = featured.map((p, i) => {
      const num = "0" + (i + 1);
      const plc = i === 1 ? "plc-b" : "plc";
      const flip = i % 2 === 0 ? "" : "flip";
      return `
      <button class="work-row ${flip}" data-go="work">
        <div class="thumb ${plc}"></div>
        <div class="info">
          <div class="work-meta"><span class="num">${num}</span><span class="cat">${p.cat}</span>${p.year ? `<span class="year">${p.year}</span>` : ""}</div>
          <h3>${p.name}</h3>
          <p class="desc">${p.desc}</p>
          <span class="cta">Pogledaj studiju <span class="ms" style="font-size:16px;">arrow_forward</span></span>
        </div>
      </button>`;
    }).join("");
  }

  // ===== render: services list (home band) =====
  function renderHomeServices() {
    const el = document.getElementById("home-services-list");
    el.innerHTML = services.map((s, i) => {
      const num = "(" + (i < 9 ? "0" : "") + (i + 1) + ")";
      return `<div class="service-row"><span class="num">${num}</span><span class="name">${s}</span></div>`;
    }).join("");
  }

  // ===== render: process =====
  function renderProcess() {
    const el = document.getElementById("process-grid");
    el.innerHTML = process.map(p => `
      <div class="process-item">
        <div class="pnum">${p.num}</div>
        <div class="pline"></div>
        <h3>${p.title}</h3>
        <p>${p.body}</p>
      </div>`).join("");
  }

  // ===== render: work page (filters + grid) =====
  function renderWorkFilters() {
    const el = document.getElementById("work-filters");
    const cats = [...new Set(projects.map(p => p.catKey))];
    const allOn = workFilter === null;
    let html = `<button class="btn-pill-sm ${allOn ? "on" : ""}" data-filter="all">Sve</button>`;
    html += cats.map(k => {
      const on = workFilter === k;
      return `<button class="btn-pill-sm ${on ? "on" : ""}" data-filter="${k}">${catLabel[k] || k}</button>`;
    }).join("");
    el.innerHTML = html;
    el.querySelectorAll("[data-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        const k = btn.getAttribute("data-filter");
        workFilter = (k === "all") ? null : (workFilter === k ? null : k);
        renderWorkFilters();
        renderWorkGrid();
      });
    });
  }

  function renderWorkGrid() {
    const el = document.getElementById("work-grid");
    const list = projects.filter(p => !workFilter || p.catKey === workFilter);
    el.innerHTML = list.map((p, i) => {
      const plc = i % 3 === 1 ? "plc-b" : "plc";
      return `
      <div class="work-card">
        <div class="thumb ${plc}"><span class="tag">${p.cat}</span></div>
        <div class="work-card-meta"><h3>${p.name}</h3>${p.year ? `<span class="year">${p.year}</span>` : ""}</div>
        <p class="desc">${p.desc}</p>
      </div>`;
    }).join("");
  }

  // ===== render: services page =====
  function renderTiers() {
    const el = document.getElementById("tiers");
    el.innerHTML = tiers.map(t => `
      <div class="tier ${t.dark ? "dark" : "light"}">
        <div class="no">${t.no}</div>
        <h3>${t.name}</h3>
        <p class="desc">${t.desc}</p>
        <div class="from">${t.from}</div>
        <button class="btn" data-go="contact">Upitaj</button>
      </div>`).join("");
  }

  function renderAllServices() {
    const el = document.getElementById("all-services-grid");
    el.innerHTML = services.map((s, i) => {
      const num = "(" + (i < 9 ? "0" : "") + (i + 1) + ")";
      return `<div class="service-row-sm"><span class="num">${num}</span><span class="name">${s}</span></div>`;
    }).join("");
  }

  function renderIndustries() {
    document.getElementById("industries-text").textContent = forWhomText;
  }

  // ===== render: studio page =====
  function renderValues() {
    const el = document.getElementById("values-grid");
    el.innerHTML = principles.map(p => `<p class="principle-line">${p}</p>`).join("");
  }

  // ===== page navigation =====
  const pages = ["home", "work", "services", "studio", "contact"];
  function goPage(id) {
    if (!pages.includes(id)) id = "home";
    pages.forEach(p => {
      document.getElementById("page-" + p).classList.toggle("active", p === id);
    });
    document.querySelectorAll(".nav-link").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-go") === id);
    });
    document.getElementById("cta-wrap").style.display = id === "contact" ? "none" : "block";
    window.scrollTo({ top: 0 });
    history.replaceState(null, "", id === "home" ? "#" : "#" + id);
  }

  function wireNav() {
    document.querySelectorAll("[data-go]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        goPage(el.getAttribute("data-go"));
      });
    });
  }

  // ===== forms (no backend wired yet — see README) =====
  function wireForms() {
    const contactForm = document.getElementById("contact-form");
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("form-note").classList.add("show");
      contactForm.reset();
    });
    const newsletterForm = document.getElementById("newsletter-form");
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      newsletterForm.reset();
    });
  }

  // ===== init =====
  function init() {
    renderMarquee();
    renderFeaturedWork();
    renderHomeServices();
    renderProcess();
    renderWorkFilters();
    renderWorkGrid();
    renderTiers();
    renderAllServices();
    renderIndustries();
    renderValues();
    wireNav();
    wireForms();
    const startPage = (location.hash || "").replace("#", "") || "home";
    goPage(startPage);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
