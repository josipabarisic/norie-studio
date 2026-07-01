(() => {
  // Content lives in content/site.json — edit it directly, or via the /admin CMS panel.
  let content = null;
  let workFilter = null;

  function md(text) {
    return String(text || "").replace(/\*(.+?)\*/g, "<em>$1</em>");
  }

  function slugify(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[čć]/g, "c").replace(/š/g, "s").replace(/ž/g, "z").replace(/đ/g, "dj")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  function setHTML(id, value) {
    const el = document.getElementById(id);
    if (el && value != null) el.innerHTML = md(value);
  }

  // ===== scroll reveal =====
  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;

  function observeReveals(root) {
    const els = root.querySelectorAll(".reveal:not(.in)");
    if (!revealObserver) {
      els.forEach(el => el.classList.add("in"));
      return;
    }
    els.forEach(el => revealObserver.observe(el));
  }

  // ===== static text =====
  function renderStaticText() {
    const c = content;
    setText("hero-eyebrow", c.hero.eyebrow);
    setHTML("hero-headline", c.hero.headline);
    setText("hero-subtitle", c.hero.subtitle);
    setText("hero-cta-primary", c.hero.ctaPrimary);
    setText("hero-cta-secondary", c.hero.ctaSecondary);

    setText("manifesto-eyebrow", c.manifesto.eyebrow);
    setHTML("manifesto-text", c.manifesto.text);

    setText("services-band-eyebrow", c.servicesBand.eyebrow);
    setText("services-band-heading", c.servicesBand.heading);
    setText("services-band-intro", c.servicesBand.intro);
    setText("services-band-btn", c.servicesBand.buttonLabel);

    setText("process-heading", c.process.heading);
    setText("work-intro", c.work.intro);
    setText("services-page-intro", c.servicesPage.intro);
    setText("all-services-heading", c.servicesPage.allServicesHeading);
    setText("all-services-intro", c.servicesPage.allServicesIntro);
    setText("industries-text", c.servicesPage.forWhom);

    const bioEl = document.getElementById("studio-bio");
    bioEl.innerHTML = c.studio.bio.map(p => `<p>${p}</p>`).join("");

    setHTML("contact-headline", c.contact.headline);
    setText("contact-intro", c.contact.intro);
    setText("contact-email", c.contact.email);
    setText("contact-response", c.contact.responseTime);
    setText("contact-location", c.contact.location);
    setSocialLinks("contact-socials", c.contact);
    setSocialLinks("footer-socials", c.contact);

    setText("cta-eyebrow", c.cta.eyebrow);
    setText("cta-heading", c.cta.heading);
    setText("cta-text", c.cta.text);

    setText("footer-tagline", c.footer.tagline);
    setText("footer-journal-text", c.footer.journalText);
    setText("footer-copyright", c.footer.copyright);
  }

  function setSocialLinks(containerId, contact) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const urls = [contact.instagram, contact.pinterest, contact.linkedin];
    container.querySelectorAll(".social-circle").forEach((a, i) => {
      if (urls[i]) a.href = urls[i];
    });
  }

  // ===== render: marquee =====
  function renderMarquee() {
    const el = document.getElementById("marquee");
    const row = content.services.concat(content.services);
    el.innerHTML = row.map(t => `<span>${t}</span>`).join("");
  }

  // ===== render: featured work (home) =====
  function renderFeaturedWork() {
    const el = document.getElementById("featured-work");
    const featured = content.projects.slice(0, 3);
    el.innerHTML = featured.map((p, i) => {
      const num = "0" + (i + 1);
      const plc = i === 1 ? "plc-b" : "plc";
      const flip = i % 2 === 0 ? "" : "flip";
      const thumbInner = p.image
        ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;display:block;">`
        : "";
      const thumbStyle = p.image ? ` style="aspect-ratio:2/3;background:#F5F3F3;"` : "";
      return `
      <button class="work-row ${flip} reveal" data-go="work">
        <div class="thumb ${p.image ? "" : plc}"${thumbStyle}>${thumbInner}</div>
        <div class="info">
          <div class="work-meta"><span class="num">${num}</span><span class="cat">${p.category}</span></div>
          <h3>${p.name}</h3>
          <p class="desc">${p.description}</p>
          <span class="cta">Pogledaj studiju <span class="ms" style="font-size:16px;">arrow_forward</span></span>
        </div>
      </button>`;
    }).join("");
    observeReveals(el);
  }

  // ===== render: services list (home band) =====
  function renderHomeServices() {
    const el = document.getElementById("home-services-list");
    el.innerHTML = content.services.map((s, i) => {
      const num = "(" + (i < 9 ? "0" : "") + (i + 1) + ")";
      return `<div class="service-row reveal"><span class="num">${num}</span><span class="name">${s}</span></div>`;
    }).join("");
    observeReveals(el);
  }

  // ===== render: process =====
  function renderProcess() {
    const el = document.getElementById("process-grid");
    el.innerHTML = content.process.steps.map(p => `
      <div class="process-item reveal">
        <div class="pnum">${p.num}</div>
        <div class="pline"></div>
        <h3>${p.title}</h3>
        <p>${p.body}</p>
      </div>`).join("");
    observeReveals(el);
  }

  // ===== render: work page (filters + grid) =====
  function renderWorkFilters() {
    const el = document.getElementById("work-filters");
    const cats = [...new Set(content.projects.map(p => p.category))];
    const allOn = workFilter === null;
    let html = `<button class="btn-pill-sm ${allOn ? "on" : ""}" data-filter="all">Sve</button>`;
    html += cats.map(cat => {
      const on = workFilter === cat;
      return `<button class="btn-pill-sm ${on ? "on" : ""}" data-filter="${slugify(cat)}">${cat}</button>`;
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
    const list = content.projects.filter(p => !workFilter || slugify(p.category) === workFilter);
    el.innerHTML = list.map((p, i) => {
      const plc = i % 3 === 1 ? "plc-b" : "plc";
      const thumbInner = p.image
        ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;display:block;">`
        : "";
      const thumbStyle = p.image ? ` style="aspect-ratio:2/3;background:#F5F3F3;"` : "";
      return `
      <div class="work-card reveal">
        <div class="thumb ${p.image ? "" : plc}"${thumbStyle}><span class="tag">${p.category}</span>${thumbInner}</div>
        <div class="work-card-meta"><h3>${p.name}</h3></div>
        <p class="desc">${p.description}</p>
      </div>`;
    }).join("");
    observeReveals(el);
  }

  // ===== render: services page =====
  function renderTiers() {
    const el = document.getElementById("tiers");
    el.innerHTML = content.servicesPage.tiers.map((t, i) => {
      const dark = i === 1;
      return `
      <div class="tier ${dark ? "dark" : "light"} reveal">
        <div class="no">No. ${i + 1}</div>
        <h3>${t.name}</h3>
        <p class="desc">${t.description}</p>
        <div class="from">${t.price}</div>
        <button class="btn" data-go="contact">Upitaj</button>
      </div>`;
    }).join("");
    observeReveals(el);
  }

  function renderAllServices() {
    const el = document.getElementById("all-services-grid");
    el.innerHTML = content.services.map((s, i) => {
      const num = "(" + (i < 9 ? "0" : "") + (i + 1) + ")";
      return `<div class="service-row-sm"><span class="num">${num}</span><span class="name">${s}</span></div>`;
    }).join("");
  }

  // ===== render: studio page =====
  function renderValues() {
    const el = document.getElementById("values-grid");
    el.innerHTML = content.studio.principles.map(p => `<p class="principle-line reveal">${p}</p>`).join("");
    observeReveals(el);
  }

  // ===== page navigation =====
  const pages = ["home", "work", "services", "studio", "contact"];
  function goPage(id) {
    if (!pages.includes(id)) id = "home";
    const next = document.getElementById("page-" + id);
    const current = document.querySelector(".page.active");

    if (current && current !== next) {
      current.classList.remove("show");
      setTimeout(() => current.classList.remove("active"), 450);
    }
    next.classList.add("active");
    requestAnimationFrame(() => requestAnimationFrame(() => next.classList.add("show")));
    observeReveals(next);

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

  // ===== forms =====
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
  function render() {
    renderStaticText();
    renderMarquee();
    renderFeaturedWork();
    renderHomeServices();
    renderProcess();
    renderWorkFilters();
    renderWorkGrid();
    renderTiers();
    renderAllServices();
    renderValues();
    wireNav();
    wireForms();
    observeReveals(document);
    const startPage = (location.hash || "").replace("#", "") || "home";
    goPage(startPage);
  }

  async function init() {
    const res = await fetch("content/site.json", { cache: "no-cache" });
    content = await res.json();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
