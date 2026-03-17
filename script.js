const BASE_MODEL = { 
    schuinImg: 'images/model_schuin.png', 
    frontImg: 'images/model_voor.png', 
    backImg: 'images/model_achter.png', 
    offsetX: 0, offsetY: 0, scale: 1.0 
};

const backgrounds = [
    { id: 1, img: 'https://placehold.co/450x650/ffffff/ffffff', offsetX: 0, offsetY: 0, scale: 1.0 },
    { id: 2, img: 'images/industrial.jpg', offsetX: 300, offsetY: -400, scale: 2.5 },
    { id: 3, img: 'images/forest.jpg', offsetX: 100, offsetY: -700, scale: 3.5 },
];

const products = [
    { id: 101, name: 'AGV Pista', type: 'Helmen', price: 1800, thumbnail: 'images/h1_thumbnail.png', schuinImg: 'images/h1.png', frontImg: 'images/h1_voor.png', backImg: 'images/h1_achter.png', offsetX: -8, offsetY: -30, scale: 0.9 },
    { id: 1, name: 'REVIT Jacka', type: 'jassen', price: 299, thumbnail: 'images/j1_thumbnail.png', schuinImg: 'images/j1.png', frontImg: 'images/j1_voor.png', backImg: 'images/j1_achter.png', offsetX: 15, offsetY: -10, scale: 1 },
    { id: 3, name: 'Alpinestars Leren Broek', type: 'broeken', price: 180, thumbnail: 'images/p1_thumbnail.png', schuinImg: 'images/p1.png', frontImg: 'images/p1_voor.png', backImg: 'images/p1_achter.png', offsetX: 0, offsetY: 0, scale: 1 },
    { id: 201, name: 'Racing Boots', type: 'schoenen', price: 250, thumbnail: 'images/boots-thumb.png', schuinImg: 'https://placehold.co/400x600/222/fff?text=BOOTS_SCHUIN', frontImg: 'images/boots_front.png', backImg: 'images/boots_back.png', offsetX: 0, offsetY: 250, scale: 0.3 },
    { id: 301, name: 'REVIT Handschoenen', type: 'handschoenen', price: 99, thumbnail: 'images/g1_thumbnail.png', schuinImg: 'images/g2.png', frontImg: 'images/g2_voor.png', backImg: 'images/g2_achter.png', offsetX: 0, offsetY: 0, scale: 0.95 },
];

const categories = ['Helmen', 'jassen', 'broeken', 'schoenen', 'handschoenen'];
const viewCycle = ['schuin', 'front', 'back'];

// --- STATE ---
let activeCategory = 'jassen';
let viewIndex = 0;
let activeBg = backgrounds[0];
let selected = { Helmen: null, jassen: null, broeken: null, schoenen: null, handschoenen: null };

// --- HELPERS ---
const getImgByView = (obj, view) => {
    if (view === 'schuin') return obj.schuinImg;
    if (view === 'front') return obj.frontImg;
    return obj.backImg;
};

// --- RENDER FUNCTIONS ---
function render() {
    renderGrid();
    renderCategories();
    renderPreview();
    renderBackgrounds();
    updateTotal();
}

function renderGrid() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    
    const displayItems = products.filter(p => p.type === activeCategory);
    const slots = [...displayItems, ...Array(Math.max(0, 18 - displayItems.length)).fill(null)];

    slots.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'grid-slot';
        
        if (item) {
            const isActive = selected[activeCategory]?.id === item.id;
            div.innerHTML = `
                <button class="product-btn ${isActive ? 'active' : ''}">
                    <img src="${item.thumbnail}" alt="${item.name}">
                    <div class="product-name">${item.name}</div>
                    ${isActive ? '<div class="dot"></div>' : ''}
                </button>
            `;
            div.querySelector('button').onclick = () => selectItem(item);
        } else {
            div.innerHTML = `<div class="empty-slot">Leeg</div>`;
        }
        grid.appendChild(div);
    });
}

function renderCategories() {
    const bar = document.getElementById('categoryBar');
    bar.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `cat-btn ${activeCategory === cat ? 'active' : ''}`;
        btn.innerHTML = `${cat}${activeCategory === cat ? '<div class="cat-indicator"></div>' : ''}`;
        btn.onclick = () => { activeCategory = cat; render(); };
        bar.appendChild(btn);
    });
}

function renderPreview() {
    const currentView = viewCycle[viewIndex];
    
    // Background
    const bgImg = document.getElementById('bgImg');
    bgImg.src = activeBg.img;
    bgImg.style.transform = `translateX(${activeBg.offsetX}px) translateY(${activeBg.offsetY}px) scale(${activeBg.scale})`;

    // Base Model
    const modelImg = document.getElementById('baseModelImg');
    modelImg.src = getImgByView(BASE_MODEL, currentView);
    modelImg.style.transform = `translateX(${BASE_MODEL.offsetX}px) translateY(${BASE_MODEL.offsetY}px) scale(${BASE_MODEL.scale})`;

    // Selected Items Layers
    const layersContainer = document.getElementById('selectedLayers');
    layersContainer.innerHTML = '';

    const order = { broeken: 10, schoenen: 11, jassen: 20, handschoenen: 21, Helmen: 30 };
    const activeItems = Object.values(selected)
        .filter(Boolean)
        .sort((a, b) => order[a.type] - order[b.type]);

    activeItems.forEach(item => {
        const img = document.createElement('img');
        img.src = getImgByView(item, currentView);
        img.className = 'item-layer';
        img.style.zIndex = item.type === 'Helmen' ? 50 : 20;
        img.style.transform = `translateX(${item.offsetX || 0}px) translateY(${item.offsetY || 0}px) scale(${item.scale || 1})`;
        layersContainer.appendChild(img);
    });
}

function renderBackgrounds() {
    const container = document.getElementById('bgSelector');
    container.innerHTML = '';
    backgrounds.forEach(bg => {
        const btn = document.createElement('button');
        btn.className = `bg-dot ${activeBg.id === bg.id ? 'active' : ''}`;
        btn.innerHTML = `<img src="${bg.img}">`;
        btn.onclick = () => { activeBg = bg; render(); };
        container.appendChild(btn);
    });
}

function selectItem(item) {
    if (selected[item.type]?.id === item.id) {
        selected[item.type] = null;
    } else {
        selected[item.type] = item;
    }
    render();
}

function updateTotal() {
    const total = Object.values(selected).reduce((sum, item) => sum + (item?.price || 0), 0);
    document.getElementById('totalPrice').innerText = `€${total.toFixed(2)}`;
}

// --- NAVIGATION ---
document.getElementById('nextBtn').onclick = () => {
    viewIndex = (viewIndex + 1) % viewCycle.length;
    render();
};

document.getElementById('prevBtn').onclick = () => {
    viewIndex = (viewIndex - 1 + viewCycle.length) % viewCycle.length;
    render();
};

// Initial Render
render();
