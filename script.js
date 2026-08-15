const revealTargets = document.querySelectorAll('.reveal');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

const SHEET_CONFIG = {
  spreadsheetId: '1EuOCA-GcGV1aFwXUV10_kIvvHnZzxFb-Dz9nv4IJRZw',
  gid: '234732728',
};

function setMobileNavState(isOpen) {
  if (!navToggle || !navLinks) {
    return;
  }

  navToggle.setAttribute('aria-expanded', String(isOpen));
  navLinks.classList.toggle('is-open', isOpen);
}

function initialiseMobileNav() {
  if (!navToggle || !navLinks) {
    return;
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setMobileNavState(!isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMobileNavState(false);
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      setMobileNavState(false);
    }
  });
}

let renderedJewels = [];

const quickViewState = {
  productIndex: -1,
  imageIndex: 0,
};

const quickViewElements = {
  shell: document.getElementById('product-quickview'),
  image: document.getElementById('quickview-image'),
  category: document.getElementById('quickview-category'),
  availability: document.getElementById('quickview-availability'),
  title: document.getElementById('quickview-title'),
  description: document.getElementById('quickview-description'),
  price: document.getElementById('quickview-price'),
  actions: document.getElementById('quickview-actions'),
  thumbs: document.getElementById('quickview-thumbs'),
};

function createFallbackImage(product) {
  const lines = [product.subcategory || product.category, product.product_name];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 520">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#fff6ee" />
          <stop offset="52%" stop-color="#f6d4e1" />
          <stop offset="100%" stop-color="#e9bf6f" />
        </linearGradient>
      </defs>
      <rect width="720" height="520" rx="36" fill="url(#bg)" />
      <circle cx="590" cy="120" r="88" fill="rgba(162,37,83,0.12)" />
      <circle cx="130" cy="390" r="120" fill="rgba(201,154,58,0.14)" />
      <text x="48" y="96" fill="#8f2450" font-size="28" font-family="Arial, sans-serif">${lines[0]}</text>
      <text x="48" y="180" fill="#5a183e" font-size="46" font-weight="700" font-family="Arial, sans-serif">${lines[1]}</text>
      <text x="48" y="248" fill="#7d5f6d" font-size="24" font-family="Arial, sans-serif">Add product photo URL in Google Sheets</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function groupProductsBySubcategory(products) {
  return products.reduce((groups, product) => {
    const key = product.subcategory || 'General';
    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(product);
    return groups;
  }, {});
}

function getProductImages(product) {
  const imageKeys = ['image_url_1', 'image_url_2', 'image_url_3', 'image_url_4'];
  return imageKeys.map((key) => product[key]).filter((url) => typeof url === 'string' && url.trim().length > 0);
}

function getProductVideos(product) {
  const videoKeys = ['video_url_1', 'video_url_2'];
  return videoKeys.map((key) => product[key]).filter((url) => typeof url === 'string' && url.trim().length > 0);
}

function getQuickViewImages(product) {
  const images = getProductImages(product);
  return images.length ? images : [createFallbackImage(product)];
}

function formatPrice(product) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: product.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(Number(product.price));
}

function buildProductEnquiryMessage(product, primaryImageUrl, primaryVideoUrl) {
  const pageUrl = window.location.protocol === 'file:'
    ? 'https://fashions.maaworld.in/#catalogue'
    : `${window.location.href.split('#')[0]}#catalogue`;
  const categoryLabel = product.subcategory ? `${product.category} / ${product.subcategory}` : product.category;
  const customNote = String(product.whatsapp_message || '').trim();

  const lines = [
    'Hi Maa World team,',
    'I would like to enquire about this product:',
    `Product ID: ${product.id || 'N/A'}`,
    `Name: ${product.product_name || 'N/A'}`,
    `Category: ${categoryLabel || 'N/A'}`,
    `Price: ${formatPrice(product)}`,
    `Product link: ${pageUrl}`,
  ];

  if (primaryImageUrl) {
    lines.push(`Image reference: ${primaryImageUrl}`);
  }

  if (primaryVideoUrl) {
    lines.push(`Video reference: ${primaryVideoUrl}`);
  }

  if (customNote && !customNote.toLowerCase().includes('i want details')) {
    lines.push(`Additional note: ${customNote}`);
  }

  return lines.join('\n');
}

function renderQuickView() {
  const product = renderedJewels[quickViewState.productIndex];
  if (!product || !quickViewElements.shell) {
    return;
  }

  const images = getQuickViewImages(product);
  const imageCount = images.length;
  const boundedImageIndex = ((quickViewState.imageIndex % imageCount) + imageCount) % imageCount;
  quickViewState.imageIndex = boundedImageIndex;

  quickViewElements.image.src = images[boundedImageIndex];
  quickViewElements.image.alt = `${product.product_name} image ${boundedImageIndex + 1}`;
  quickViewElements.category.textContent = product.subcategory || product.category || 'Product';

  const availabilityClass = `availability-${String(product.availability || 'in-stock').toLowerCase().replace(/\s+/g, '-')}`;
  quickViewElements.availability.className = `availability ${availabilityClass}`;
  quickViewElements.availability.textContent = product.availability || 'In Stock';

  quickViewElements.title.textContent = product.product_name || 'Product details';
  quickViewElements.description.textContent = product.short_description || 'No description available yet.';
  quickViewElements.price.textContent = formatPrice(product);

  const videos = getProductVideos(product);
  quickViewElements.actions.innerHTML = videos[0]
    ? `<a class="button button-small button-video" href="${videos[0]}" target="_blank" rel="noreferrer">Watch product video</a>`
    : '';

  quickViewElements.thumbs.innerHTML = images
    .map((url, index) => {
      const activeClass = index === boundedImageIndex ? ' is-active' : '';
      return `
        <button class="quickview-thumb${activeClass}" type="button" data-quickview-thumb-index="${index}" aria-label="Show image ${index + 1}">
          <img src="${url}" alt="${product.product_name} thumbnail ${index + 1}" loading="lazy" />
        </button>
      `;
    })
    .join('');
}

function openQuickView(productIndex, imageIndex = 0) {
  if (!quickViewElements.shell || !renderedJewels[productIndex]) {
    return;
  }

  quickViewState.productIndex = productIndex;
  quickViewState.imageIndex = imageIndex;
  quickViewElements.shell.hidden = false;
  document.body.style.overflow = 'hidden';
  renderQuickView();
}

function closeQuickView() {
  if (!quickViewElements.shell) {
    return;
  }

  quickViewElements.shell.hidden = true;
  document.body.style.overflow = '';
}

function shiftQuickViewImage(direction) {
  const product = renderedJewels[quickViewState.productIndex];
  if (!product) {
    return;
  }

  const images = getQuickViewImages(product);
  quickViewState.imageIndex = (quickViewState.imageIndex + direction + images.length) % images.length;
  renderQuickView();
}

function initialiseQuickViewInteractions() {
  if (!quickViewElements.shell) {
    return;
  }

  document.addEventListener('click', (event) => {
    const closeTrigger = event.target.closest('[data-quickview-close]');
    if (closeTrigger) {
      closeQuickView();
      return;
    }

    const nextTrigger = event.target.closest('[data-quickview-next]');
    if (nextTrigger) {
      shiftQuickViewImage(1);
      return;
    }

    const prevTrigger = event.target.closest('[data-quickview-prev]');
    if (prevTrigger) {
      shiftQuickViewImage(-1);
      return;
    }

    const thumbTrigger = event.target.closest('[data-quickview-thumb-index]');
    if (thumbTrigger) {
      quickViewState.imageIndex = Number(thumbTrigger.dataset.quickviewThumbIndex || 0);
      renderQuickView();
      return;
    }

    const openTrigger = event.target.closest('[data-open-quickview]');
    if (openTrigger) {
      const productIndex = Number(openTrigger.dataset.productIndex);
      const imageIndex = Number(openTrigger.dataset.imageIndex || 0);
      openQuickView(productIndex, imageIndex);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (quickViewElements.shell.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      closeQuickView();
      return;
    }

    if (event.key === 'ArrowRight') {
      shiftQuickViewImage(1);
      return;
    }

    if (event.key === 'ArrowLeft') {
      shiftQuickViewImage(-1);
    }
  });
}

function normaliseColumnKey(label) {
  return String(label || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function parseGvizResponse(rawText) {
  const match = rawText.match(/google\.visualization\.Query\.setResponse\((.*)\);?$/s);
  if (!match) {
    throw new Error('Unable to parse Google Sheets response payload.');
  }

  const payload = JSON.parse(match[1]);
  const table = payload.table || {};
  const columns = (table.cols || []).map((col) => normaliseColumnKey(col.label || col.id));
  const rows = table.rows || [];

  return rows.map((row) => {
    const record = {};
    columns.forEach((column, index) => {
      const cell = row.c?.[index];
      record[column] = cell && cell.v !== null && cell.v !== undefined ? String(cell.v).trim() : '';
    });
    return record;
  });
}

async function loadProductsFromSheet() {
  const { spreadsheetId, gid } = SHEET_CONFIG;
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${gid}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Google Sheets request failed with status ${response.status}.`);
  }

  const body = await response.text();
  return parseGvizResponse(body);
}

function renderCatalogue(products) {
  const container = document.getElementById('product-groups');

  if (!container || !Array.isArray(products)) {
    return;
  }

  const jewelProducts = products
    .filter((product) => product.category === 'Jewels')
    .sort((left, right) => Number(left.sort_order) - Number(right.sort_order))
    .map((product, index) => ({ ...product, _catalogueIndex: index }));

  renderedJewels = jewelProducts;

  const grouped = groupProductsBySubcategory(jewelProducts);

  container.innerHTML = Object.entries(grouped)
    .map(([subcategory, items]) => {
      const cards = items
        .map((product) => {
          const images = getProductImages(product);
          const imageSrc = images[0] || createFallbackImage(product);
          const price = formatPrice(product);
          const thumbs = images.slice(1).map((url, index) => `
            <button class="product-thumb-trigger" type="button" data-open-quickview data-product-index="${product._catalogueIndex}" data-image-index="${index + 1}" aria-label="Open ${product.product_name} image ${index + 2}">
              <img class="product-thumb" src="${url}" alt="${product.product_name} view ${index + 2}" loading="lazy" />
            </button>
          `).join('');
          const videos = getProductVideos(product);
          const message = encodeURIComponent(buildProductEnquiryMessage(product, imageSrc, videos[0]));
          const videoCta = videos[0]
            ? `<a class="button button-outline button-small" href="${videos[0]}" target="_blank" rel="noreferrer">Watch video</a>`
            : '';

          return `
            <article class="product-card">
              <button class="product-image-trigger" type="button" data-open-quickview data-product-index="${product._catalogueIndex}" data-image-index="0" aria-label="Open ${product.product_name}">
                <img class="product-image" src="${imageSrc}" alt="${product.product_name}" loading="lazy" />
              </button>
              <div class="product-card-body">
                <div class="product-meta-row">
                  <span class="collection-tag">${product.subcategory || product.category}</span>
                  <span class="availability availability-${String(product.availability).toLowerCase().replace(/\s+/g, '-')}">${product.availability}</span>
                </div>
                <h3>${product.product_name}</h3>
                <p>${product.short_description}</p>
                ${thumbs ? `<div class="product-thumb-row">${thumbs}</div>` : ''}
                <div class="product-footer-row">
                  <strong>${price}</strong>
                  <div class="product-actions">
                    <button class="button button-small button-quickview" type="button" data-open-quickview data-product-index="${product._catalogueIndex}" data-image-index="0">Quick view</button>
                    ${videoCta}
                    <a class="button button-secondary button-small" href="https://wa.me/919059810708?text=${message}" target="_blank" rel="noreferrer">Enquire</a>
                  </div>
                </div>
              </div>
            </article>
          `;
        })
        .join('');

      return `
        <section class="product-group">
          <div class="product-group-heading">
            <p class="eyebrow">Jewels</p>
            <h3>${subcategory}</h3>
          </div>
          <div class="product-grid">${cards}</div>
        </section>
      `;
    })
    .join('');
}

initialiseQuickViewInteractions();
initialiseMobileNav();

async function initialiseCatalogue() {
  try {
    const sheetProducts = await loadProductsFromSheet();
    if (Array.isArray(sheetProducts) && sheetProducts.length > 0) {
      renderCatalogue(sheetProducts);
      return;
    }
  } catch (error) {
    console.warn('Falling back to local catalogue data.', error);
  }

  renderCatalogue(window.PRODUCTS || []);
}

initialiseCatalogue();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          instance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((element) => {
    element.style.animationPlayState = 'paused';
    observer.observe(element);
  });
}
