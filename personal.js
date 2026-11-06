(function () {
  "use strict";

  /* =====================================================
     THEME
     ===================================================== */

  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");

  function getPreferredTheme() {
    var savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }

    localStorage.setItem("theme", theme);
  }

  /* Apply saved theme immediately */
  applyTheme(getPreferredTheme());

  /* Theme button */

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      /* Restart animation */
      themeToggle.classList.remove("theme-click");

      void themeToggle.offsetWidth;

      themeToggle.classList.add("theme-click");

      var currentTheme =
        root.getAttribute("data-theme") === "dark" ? "dark" : "light";

      var newTheme = currentTheme === "dark" ? "light" : "dark";

      applyTheme(newTheme);
    });
  }

  /* =====================================================
     SCROLL REVEAL
     ===================================================== */

  var animatedElements = document.querySelectorAll(
    [
      "section",
      ".interest-card",
      ".skill-group",
      ".tl-item",
      ".cert-slide",
      ".badge-card",
      ".proj-card",
      ".review-card",
      ".review-panel",
      ".terminal",
      ".about-grid",
      ".hero-text",
      ".hero-graphic",
    ].join(","),
  );

  animatedElements.forEach(function (element, index) {
    element.classList.add("scroll-reveal");

    var delay = (index % 6) * 70;

    element.style.setProperty("--reveal-delay", delay + "ms");
  });

  /* Intersection Observer */

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,

        rootMargin: "0px 0px -50px 0px",
      },
    );

    animatedElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    animatedElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  /* =====================================================
     BUTTON PRESS ANIMATION
     ===================================================== */

  var buttons = document.querySelectorAll(".btn");

  buttons.forEach(function (button) {
    button.addEventListener("pointerdown", function () {
      button.classList.add("btn-pressed");
    });

    button.addEventListener("pointerup", function () {
      button.classList.remove("btn-pressed");
    });

    button.addEventListener("pointerleave", function () {
      button.classList.remove("btn-pressed");
    });

    button.addEventListener("pointercancel", function () {
      button.classList.remove("btn-pressed");
    });
  });

  /* =====================================================
     CERTIFICATE CAROUSEL
     ===================================================== */

  var certWrap = document.getElementById("certWrap");

  var certTrack = document.getElementById("certTrack");

  var certDots = document.getElementById("certDots");

  var certPrev = document.getElementById("certPrev");

  var certNext = document.getElementById("certNext");

  if (certWrap && certTrack) {
    var slides = Array.prototype.slice.call(certTrack.children);

    var current = 0;

    var dots = [];

    if (slides.length > 0) {
      /* Create dots */

      if (certDots) {
        slides.forEach(function (_, index) {
          var dot = document.createElement("button");

          dot.type = "button";

          dot.className = "cert-dot" + (index === 0 ? " active" : "");

          dot.setAttribute("aria-label", "Go to certificate " + (index + 1));

          dot.addEventListener("click", function () {
            goTo(index);
          });

          certDots.appendChild(dot);
        });

        dots = Array.prototype.slice.call(certDots.children);
      }

      /* Set active certificate */

      function setActive(index) {
        current = index;

        slides.forEach(function (slide, slideIndex) {
          var active = slideIndex === index;

          slide.classList.toggle("active", active);

          if (active) {
            slide.classList.remove("cert-enter");

            void slide.offsetWidth;

            slide.classList.add("cert-enter");
          }
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === index);
        });
      }

      /* Go to certificate */

      function goTo(index) {
        index = (index + slides.length) % slides.length;

        slides[index].scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });

        setActive(index);
      }

      /* Previous */

      if (certPrev) {
        certPrev.addEventListener("click", function () {
          goTo(current - 1);
        });
      }

      /* Next */

      if (certNext) {
        certNext.addEventListener("click", function () {
          goTo(current + 1);
        });
      }

      /* Detect manually scrolled slide */

      var scrollTimeout;

      certWrap.addEventListener(
        "scroll",
        function () {
          clearTimeout(scrollTimeout);

          scrollTimeout = setTimeout(function () {
            var wrapRect = certWrap.getBoundingClientRect();

            var center = wrapRect.left + wrapRect.width / 2;

            var closest = 0;

            var closestDistance = Infinity;

            slides.forEach(function (slide, index) {
              var rect = slide.getBoundingClientRect();

              var slideCenter = rect.left + rect.width / 2;

              var distance = Math.abs(slideCenter - center);

              if (distance < closestDistance) {
                closestDistance = distance;

                closest = index;
              }
            });

            setActive(closest);
          }, 80);
        },
        {
          passive: true,
        },
      );

      /* Keyboard controls */

      document.addEventListener("keydown", function (event) {
        var rect = certWrap.getBoundingClientRect();

        var visible = rect.bottom > 0 && rect.top < window.innerHeight;

        if (!visible) {
          return;
        }

        if (event.key === "ArrowLeft") {
          goTo(current - 1);
        }

        if (event.key === "ArrowRight") {
          goTo(current + 1);
        }
      });

      /* Start */

      setActive(0);
    }
  }

  /* =====================================================
     REVIEWS
     ===================================================== */

  var reviewWrap = document.getElementById("reviewWrap");

  var reviewTrack = document.getElementById("reviewTrack");

  var reviewDots = document.getElementById("reviewDots");

  var reviewPrev = document.getElementById("reviewPrev");

  var reviewNext = document.getElementById("reviewNext");

  var reviewTabs = document.querySelectorAll(".review-tab");

  var reviewScore = document.getElementById("reviewScore");

  var reviewCount = document.getElementById("reviewCount");

  var reviewStars = document.getElementById("reviewStars");

  var reviewStatus = document.getElementById("reviewStatus");

  var reviewEmpty = document.getElementById("reviewEmpty");

  if (reviewWrap && reviewTrack) {
    var reviewCards = Array.prototype.slice.call(
      reviewTrack.querySelectorAll(".review-card"),
    );

    var reviewDotButtons = [];

    var reviewCurrent = 0;

    var reviewScrollTimeout;

    var reviewResizeTimeout;

    /* Visible cards only */

    function getVisibleReviews() {
      return reviewCards.filter(function (card) {
        return !card.hidden;
      });
    }

    /* How many pages the current cards create */

    function getReviewPages() {
      var cards = getVisibleReviews();

      if (!cards.length) {
        return 1;
      }

      var gap = parseFloat(window.getComputedStyle(reviewTrack).columnGap);

      if (isNaN(gap)) {
        gap = 16;
      }

      var cardWidth = cards[0].getBoundingClientRect().width;

      if (!cardWidth) {
        return 1;
      }

      var perView = Math.max(
        1,
        Math.floor((reviewWrap.clientWidth + gap + 1) / (cardWidth + gap)),
      );

      return Math.max(1, Math.ceil(cards.length / perView));
    }

    /* Arrow states */

    function updateReviewArrows() {
      var pages = getReviewPages();

      if (reviewPrev) {
        reviewPrev.hidden = pages <= 1;

        reviewPrev.disabled = reviewCurrent <= 0;
      }

      if (reviewNext) {
        reviewNext.hidden = pages <= 1;

        reviewNext.disabled = reviewCurrent >= pages - 1;
      }
    }

    /* Active dot */

    function setReviewActive(index) {
      reviewCurrent = index;

      reviewDotButtons.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });

      updateReviewArrows();
    }

    /* Move one page */

    function goToReviewPage(index) {
      var pages = getReviewPages();

      index = Math.max(0, Math.min(index, pages - 1));

      reviewWrap.scrollTo({
        left: index * reviewWrap.clientWidth,
        behavior: "smooth",
      });

      setReviewActive(index);
    }

    /* Build paging dots */

    function buildReviewDots() {
      if (!reviewDots) {
        return;
      }

      var pages = getReviewPages();

      reviewDots.innerHTML = "";

      reviewDotButtons = [];

      for (var index = 0; index < pages; index++) {
        (function (page) {
          var dot = document.createElement("button");

          dot.type = "button";

          dot.className = "review-dot";

          dot.setAttribute("aria-label", "Go to review page " + (page + 1));

          dot.addEventListener("click", function () {
            goToReviewPage(page);
          });

          reviewDots.appendChild(dot);

          reviewDotButtons.push(dot);
        })(index);
      }

      reviewDots.hidden = pages <= 1;

      setReviewActive(Math.min(reviewCurrent, pages - 1));
    }

    /* Hide "Read more" when the whole quote already fits */

    function refreshReviewText() {
      getVisibleReviews().forEach(function (card) {
        if (card.classList.contains("is-expanded")) {
          return;
        }

        var text = card.querySelector(".review-text");

        var more = card.querySelector(".review-more");

        if (!text || !more) {
          return;
        }

        more.hidden = text.scrollHeight <= text.clientHeight + 2;
      });
    }

    /* Reset expanded quotes */

    function resetReviewText() {
      reviewCards.forEach(function (card) {
        var more = card.querySelector(".review-more");

        card.classList.remove("is-expanded");

        if (more) {
          more.textContent = "Read more";

          more.setAttribute("aria-expanded", "false");
        }
      });
    }

    /* Expand / collapse each quote */

    reviewCards.forEach(function (card) {
      var more = card.querySelector(".review-more");

      if (!more) {
        return;
      }

      more.addEventListener("click", function () {
        var expanded = card.classList.toggle("is-expanded");

        more.textContent = expanded ? "Show less" : "Read more";

        more.setAttribute("aria-expanded", expanded ? "true" : "false");
      });
    });

    /* Read a card's rating from its accessible label */

    function getReviewRating(card) {
      var stars = card.querySelector(".rating-stars");

      if (!stars) {
        return null;
      }

      var label = stars.getAttribute("aria-label") || "";

      var match = label.match(/Rated\s+([\d.]+)/i);

      if (match) {
        return parseFloat(match[1]);
      }

      var rating = parseFloat(stars.style.getPropertyValue("--rating"));

      return isNaN(rating) ? null : rating;
    }

    /* Recalculate the summary from the visible cards */

    function updateReviewSummary() {
      var cards = getVisibleReviews();

      var count = cards.length;

      var ratings = cards
        .map(getReviewRating)
        .filter(function (rating) {
          return rating !== null;
        });

      var average = ratings.length
        ? ratings.reduce(function (total, rating) {
            return total + rating;
          }, 0) / ratings.length
        : null;

      var score = average === null ? "—" : average.toFixed(1);

      if (reviewScore) {
        reviewScore.textContent = score;
      }

      if (reviewCount) {
        reviewCount.textContent =
          "(" + count + (count === 1 ? " review)" : " reviews)");
      }

      if (reviewStars) {
        reviewStars.style.setProperty(
          "--rating",
          average === null ? 0 : average,
        );

        reviewStars.setAttribute(
          "aria-label",
          average === null
            ? "No rating yet"
            : "Rated " + score + " out of 5 stars",
        );
      }

      if (reviewStatus) {
        reviewStatus.textContent = count
          ? "Showing " +
            count +
            (count === 1 ? " review" : " reviews") +
            (average === null ? "." : ", rated " + score + " out of 5.")
          : "No reviews yet.";
      }

      if (reviewEmpty) {
        reviewEmpty.hidden = count > 0;
      }
    }

    /* Filter tabs */

    reviewTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var filter = tab.getAttribute("data-filter");

        reviewTabs.forEach(function (otherTab) {
          var active = otherTab === tab;

          otherTab.classList.toggle("active", active);

          otherTab.setAttribute("aria-pressed", active ? "true" : "false");
        });

        reviewCards.forEach(function (card) {
          var match =
            filter === "all" || card.getAttribute("data-source") === filter;

          card.hidden = !match;
        });

        updateReviewSummary();

        resetReviewText();

        reviewWrap.scrollLeft = 0;

        reviewCurrent = 0;

        buildReviewDots();

        refreshReviewText();

        setReviewActive(0);
      });
    });

    /* Arrows */

    if (reviewPrev) {
      reviewPrev.addEventListener("click", function () {
        goToReviewPage(reviewCurrent - 1);
      });
    }

    if (reviewNext) {
      reviewNext.addEventListener("click", function () {
        goToReviewPage(reviewCurrent + 1);
      });
    }

    /* Keep dots in sync while scrolling */

    reviewWrap.addEventListener(
      "scroll",
      function () {
        clearTimeout(reviewScrollTimeout);

        reviewScrollTimeout = setTimeout(function () {
          var pages = getReviewPages();

          var maxScroll = reviewWrap.scrollWidth - reviewWrap.clientWidth;

          var page;

          if (reviewWrap.scrollLeft >= maxScroll - 4) {
            page = pages - 1;
          } else {
            page = Math.round(
              reviewWrap.scrollLeft / Math.max(1, reviewWrap.clientWidth),
            );
          }

          setReviewActive(Math.max(0, Math.min(page, pages - 1)));
        }, 80);
      },
      {
        passive: true,
      },
    );

    /* Recalculate on resize */

    window.addEventListener("resize", function () {
      clearTimeout(reviewResizeTimeout);

      reviewResizeTimeout = setTimeout(function () {
        var pages = getReviewPages();

        var page = Math.min(reviewCurrent, pages - 1);

        reviewWrap.scrollLeft = page * reviewWrap.clientWidth;

        buildReviewDots();

        refreshReviewText();

        setReviewActive(page);
      }, 120);
    });

    /* Start */

    buildReviewDots();

    refreshReviewText();

    updateReviewSummary();

    window.addEventListener("load", function () {
      buildReviewDots();

      refreshReviewText();

      updateReviewSummary();
    });
  }

  /* =====================================================
     INTEREST CARD ICON ANIMATION
     ===================================================== */

  var interestCards = document.querySelectorAll(".interest-card");

  interestCards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      var icon = card.querySelector(".interest-icon");

      if (!icon) {
        return;
      }

      icon.classList.remove("icon-animate");

      void icon.offsetWidth;

      icon.classList.add("icon-animate");
    });
  });

  /* =====================================================
     SKILL TAG STAGGER
     ===================================================== */

  var skillTags = document.querySelectorAll(".skill-tags .tag");

  skillTags.forEach(function (tag, index) {
    tag.style.setProperty("--tag-delay", index * 35 + "ms");
  });

  /* =====================================================
     LIVE GITHUB PROJECTS
     ===================================================== */

  var projectGrid = document.getElementById("projectGrid");

  var PROJECT_GITHUB_USER = "clrkrio-dev";

  var PROJECT_CACHE_KEY = "clrkrio-projects-v1";

  var PROJECT_CACHE_TTL = 60 * 60 * 1000;

  var PROJECT_EXCLUDED = ["personal-website", "clrkrio-dev"];

  function readProjectCache() {
    try {
      var stored = localStorage.getItem(PROJECT_CACHE_KEY);

      if (!stored) {
        return null;
      }

      var parsed = JSON.parse(stored);

      if (
        !parsed ||
        !Array.isArray(parsed.projects) ||
        typeof parsed.savedAt !== "number"
      ) {
        return null;
      }

      return parsed;
    } catch (error) {
      return null;
    }
  }

  function writeProjectCache(projects) {
    try {
      localStorage.setItem(
        PROJECT_CACHE_KEY,
        JSON.stringify({
          savedAt: Date.now(),
          projects: projects,
        }),
      );
    } catch (error) {
      /* Storage can be unavailable in private mode */
    }
  }

  function prettyProjectName(name) {
    return name
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
      });
  }

  function formatProjectDate(value) {
    var date = new Date(value);

    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  function summarizeReadme(markdown) {
    if (!markdown) {
      return "";
    }

    var text = markdown
      .replace(/^---[\s\S]*?---/, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/~~~[\s\S]*?~~~/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/<[^>]+>/g, " ")
      .replace(/^#{1,6}\s.*$/gm, " ")
      .replace(/^[=\-]{3,}\s*$/gm, " ")
      .replace(/[`*_~]/g, "")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!text) {
      return "";
    }

    if (text.length <= 210) {
      return text;
    }

    var shortened = text.slice(0, 210);

    var lastSpace = shortened.lastIndexOf(" ");

    if (lastSpace > 120) {
      shortened = shortened.slice(0, lastSpace);
    }

    return shortened.replace(/[.,;:!?]+$/, "") + "…";
  }

  function fetchReadmeSummary(repoName) {
    var url =
      "https://api.github.com/repos/" +
      PROJECT_GITHUB_USER +
      "/" +
      encodeURIComponent(repoName) +
      "/readme";

    return fetch(url, {
      headers: {
        Accept: "application/vnd.github.raw",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
      .then(function (response) {
        if (!response.ok) {
          return "";
        }

        return response.text().then(summarizeReadme);
      })
      .catch(function () {
        return "";
      });
  }

  function fallbackProjectDescription(language) {
    if (language) {
      return (
        "Built with " +
        language +
        " and hosted on GitHub — open the repository to explore the code."
      );
    }

    return "A live GitHub repository — open it to explore the code.";
  }

  function fetchLiveProjects() {
    var url =
      "https://api.github.com/users/" +
      PROJECT_GITHUB_USER +
      "/repos?per_page=100&sort=pushed";

    return fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("GitHub request failed: " + response.status);
        }

        return response.json();
      })
      .then(function (repos) {
        if (!Array.isArray(repos)) {
          throw new Error("GitHub returned an unexpected response.");
        }

        var selected = repos
          .filter(function (repo) {
            return (
              repo &&
              !repo.fork &&
              !repo.archived &&
              !repo.disabled &&
              !repo.private &&
              PROJECT_EXCLUDED.indexOf(repo.name) === -1
            );
          })
          .sort(function (a, b) {
            return (
              new Date(b.pushed_at || b.updated_at) -
              new Date(a.pushed_at || a.updated_at)
            );
          });

        return Promise.all(
          selected.map(function (repo) {
            return fetchReadmeSummary(repo.name).then(function (summary) {
              return {
                name: repo.name,
                title: prettyProjectName(repo.name),
                description:
                  summary ||
                  repo.description ||
                  fallbackProjectDescription(repo.language),
                url: repo.html_url,
                language: repo.language || "",
                topics: Array.isArray(repo.topics)
                  ? repo.topics.slice(0, 5)
                  : [],
                stars: repo.stargazers_count || 0,
                updated: repo.pushed_at || repo.updated_at,
                homepage: repo.homepage || "",
              };
            });
          }),
        );
      });
  }

  function renderProjectStatus(message, linkText, linkUrl) {
    if (!projectGrid) {
      return;
    }

    projectGrid.innerHTML = "";

    var status = document.createElement("p");

    status.className = "proj-status";

    status.setAttribute("role", "status");

    status.appendChild(document.createTextNode(message));

    if (linkText && linkUrl) {
      var link = document.createElement("a");

      link.href = linkUrl;

      link.target = "_blank";

      link.rel = "noopener noreferrer";

      link.textContent = linkText;

      status.appendChild(document.createTextNode(" "));

      status.appendChild(link);
    }

    projectGrid.appendChild(status);

    projectGrid.setAttribute("aria-busy", "false");
  }

  function createProjectCard(project) {
    var card = document.createElement("div");

    card.className = "proj-card";

    var title = document.createElement("p");

    title.className = "proj-title";

    var titleLink = document.createElement("a");

    titleLink.href = project.url;

    titleLink.target = "_blank";

    titleLink.rel = "noopener noreferrer";

    titleLink.textContent = project.title;

    var external = document.createElement("span");

    external.className = "proj-external";

    external.setAttribute("aria-hidden", "true");

    external.textContent = " ↗";

    titleLink.appendChild(external);

    title.appendChild(titleLink);

    card.appendChild(title);

    var description = document.createElement("p");

    description.className = "proj-desc";

    description.textContent = project.description;

    card.appendChild(description);

    var tags = project.topics.length
      ? project.topics
      : project.language
        ? [project.language]
        : [];

    if (tags.length) {
      var stack = document.createElement("div");

      stack.className = "proj-stack";

      tags.forEach(function (tag) {
        var item = document.createElement("span");

        item.textContent = tag;

        stack.appendChild(item);
      });

      card.appendChild(stack);
    }

    var meta = document.createElement("div");

    meta.className = "proj-meta";

    if (project.updated) {
      var updated = document.createElement("span");

      updated.textContent = "Updated " + formatProjectDate(project.updated);

      meta.appendChild(updated);
    }

    if (project.stars > 0) {
      var stars = document.createElement("span");

      stars.textContent = "★ " + project.stars;

      meta.appendChild(stars);
    }

    if (project.homepage && /^https?:\/\//i.test(project.homepage)) {
      var liveLink = document.createElement("a");

      liveLink.href = project.homepage;

      liveLink.target = "_blank";

      liveLink.rel = "noopener noreferrer";

      liveLink.textContent = "Live site ↗";

      meta.appendChild(liveLink);
    }

    if (meta.children.length) {
      card.appendChild(meta);
    }

    return card;
  }

  function renderProjects(projects) {
    if (!projectGrid) {
      return;
    }

    projectGrid.innerHTML = "";

    projectGrid.setAttribute("aria-busy", "false");

    if (!projects.length) {
      renderProjectStatus(
        "No public repositories found yet.",
        "View the GitHub profile ↗",
        "https://github.com/" + PROJECT_GITHUB_USER,
      );

      return;
    }

    projects.forEach(function (project) {
      projectGrid.appendChild(createProjectCard(project));
    });
  }

  function loadLiveProjects() {
    if (!projectGrid) {
      return;
    }

    var cached = readProjectCache();

    var hasCachedProjects = cached && cached.projects.length > 0;

    var cacheIsFresh =
      hasCachedProjects && Date.now() - cached.savedAt < PROJECT_CACHE_TTL;

    if (hasCachedProjects) {
      renderProjects(cached.projects);
    }

    if (cacheIsFresh) {
      return;
    }

    if (!hasCachedProjects) {
      projectGrid.innerHTML = "";

      var loading = document.createElement("p");

      loading.className = "proj-status";

      loading.setAttribute("role", "status");

      loading.textContent = "Loading repositories from GitHub…";

      projectGrid.appendChild(loading);

      projectGrid.setAttribute("aria-busy", "true");
    }

    fetchLiveProjects()
      .then(function (projects) {
        writeProjectCache(projects);

        renderProjects(projects);
      })
      .catch(function () {
        if (hasCachedProjects) {
          return;
        }

        renderProjectStatus(
          "Could not load GitHub repositories right now.",
          "View them on GitHub ↗",
          "https://github.com/" + PROJECT_GITHUB_USER,
        );
      });
  }

  loadLiveProjects();

  /* =====================================================
     PROJECT CARD HOVER
     ===================================================== */

  if (projectGrid) {
    projectGrid.addEventListener("mousemove", function (event) {
      var target = event.target;

      var card = target && target.closest ? target.closest(".proj-card") : null;

      if (!card) {
        return;
      }

      var rect = card.getBoundingClientRect();

      var x = event.clientX - rect.left;

      var y = event.clientY - rect.top;

      var rotateX = (y / rect.height - 0.5) * -3;

      var rotateY = (x / rect.width - 0.5) * 3;

      card.style.transform =
        "translateY(-9px) " +
        "perspective(700px) " +
        "rotateX(" +
        rotateX +
        "deg) " +
        "rotateY(" +
        rotateY +
        "deg)";
    });

    projectGrid.addEventListener("mouseout", function (event) {
      var target = event.target;

      var card = target && target.closest ? target.closest(".proj-card") : null;

      if (!card) {
        return;
      }

      if (card.contains(event.relatedTarget)) {
        return;
      }

      card.style.transform = "";
    });
  }

  /* =====================================================
     TERMINAL CURSOR EFFECT
     ===================================================== */

  var terminal = document.querySelector(".terminal");

  if (terminal) {
    terminal.classList.add("terminal-ready");
  }

  /* =====================================================
     ACTIVE NAVIGATION ON SCROLL
     ===================================================== */

  var navLinks = document.querySelectorAll(".nav-links a[href^='#']");

  var sections = document.querySelectorAll("section[id]");

  if (navLinks.length && sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          var id = entry.target.id;

          navLinks.forEach(function (link) {
            var href = link.getAttribute("href");

            link.classList.toggle("active", href === "#" + id);
          });
        });
      },
      {
        threshold: 0.35,
      },
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* =====================================================
     SMOOTH ANCHOR SCROLL
     ===================================================== */

  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');

    if (!link) {
      return;
    }

    var targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    var target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  /* =====================================================
     MOUSE PARALLAX FOR HERO GRAPHIC
     ===================================================== */

  var heroGraphic = document.querySelector(".hero-graphic");

  if (
    heroGraphic &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.addEventListener("mousemove", function (event) {
      var x = (event.clientX / window.innerWidth - 0.5) * 6;

      var y = (event.clientY / window.innerHeight - 0.5) * 6;

      heroGraphic.style.transform = "translate(" + x + "px, " + y + "px)";
    });
  }

  /* =====================================================
     RESET PARALLAX WHEN REDUCED MOTION
     ===================================================== */

  window.addEventListener("resize", function () {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      heroGraphic
    ) {
      heroGraphic.style.transform = "";
    }
  });
})();
