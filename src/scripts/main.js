const cards = Array.from(document.querySelectorAll(".card"));
const empty = document.querySelector(".popular__empty");
const searchForm = document.querySelector(".hero__search");
const searchInput = document.querySelector(".hero__search-input");
const dropdown = document.querySelector(".header__dropdown");
const dropdownButton = document.querySelector(".header__menu-button");
const status = document.querySelector(".popular__status");
const moreButton = document.querySelector(".popular__more");
const collectionLink = document.querySelector("[data-collection]");

let category = "all";
let collectionOnly = false;

function visibleCards() {
    return cards.filter((card) => !card.hidden);
}

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let shown = 0;

    cards.forEach((card) => {
        const name = card.dataset.name.toLowerCase();
        const matchesQuery = name.includes(query);
        const matchesCategory = category === "all" || card.dataset.category === category;
        const matchesCollection = !collectionOnly || card.classList.contains("card_saved");
        const show = matchesQuery && matchesCategory && matchesCollection;
        card.hidden = !show;
        if (show) {
            shown += 1;
        }
    });

    if (shown === 0) {
        empty.hidden = false;
        empty.textContent = collectionOnly
            ? "Your collection is empty. Save a tool with the folder icon."
            : "No tools match your search.";
    } else {
        empty.hidden = true;
    }
}

function setCategory(nextCategory) {
    category = nextCategory;
    collectionOnly = false;
    applyFilters();
    dropdown.hidden = true;
    dropdownButton.setAttribute("aria-expanded", "false");
}

dropdownButton.addEventListener("click", () => {
    const open = dropdown.hidden;
    dropdown.hidden = !open;
    dropdownButton.setAttribute("aria-expanded", String(open));
});

dropdown.addEventListener("click", (event) => {
    const option = event.target.closest("[data-category]");
    if (!option) {
        return;
    }
    setCategory(option.dataset.category);
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".header__menu-item_dropdown")) {
        dropdown.hidden = true;
        dropdownButton.setAttribute("aria-expanded", "false");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        dropdown.hidden = true;
        dropdownButton.setAttribute("aria-expanded", "false");
    }
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    collectionOnly = false;
    applyFilters();
    document.getElementById("popular").scrollIntoView({ behavior: "smooth", block: "start" });
});

searchInput.addEventListener("input", () => {
    collectionOnly = false;
    applyFilters();
});

collectionLink.addEventListener("click", () => {
    collectionOnly = true;
    category = "all";
    searchInput.value = "";
    applyFilters();
});

cards.forEach((card) => {
    const like = card.querySelector(".card__like");
    const save = card.querySelector(".card__save");

    like.addEventListener("click", () => {
        const pressed = like.getAttribute("aria-pressed") !== "true";
        like.setAttribute("aria-pressed", String(pressed));
        like.classList.toggle("card__like_active", pressed);
    });

    save.addEventListener("click", () => {
        const pressed = save.getAttribute("aria-pressed") === "true";
        save.setAttribute("aria-pressed", String(!pressed));
        save.classList.toggle("card__save_active", !pressed);
        card.classList.toggle("card_saved", !pressed);
        if (collectionOnly) {
            applyFilters();
        }
    });
});

moreButton.addEventListener("click", () => {
    const shown = visibleCards().length;
    status.textContent = shown === cards.length
        ? "All popular tools are already visible."
        : `Showing ${shown} of ${cards.length} tools. Clear the filter to see the rest.`;
});
