document.addEventListener('DOMContentLoaded', () => {
    // Product Data
    let products = [];
    let filteredProducts = [];

    // Load Products from CSV
    fetch('products.csv')
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split('\n').slice(1); // Skip header
            products = rows.map(row => {
                const [name, category, wattage, beamAngle, ipRating, description] = row.split(',');
                return {
                    name: name.trim(),
                    category: category.trim(),
                    wattage: wattage.trim(),
                    beamAngle: beamAngle.trim(),
                    ipRating: ipRating.trim(),
                    description: description.trim()
                };
            });
            filteredProducts = products;
            renderProducts(filteredProducts);
            renderFilters();
        })
        .catch(error => console.error('Error loading products:', error));

    // Render Products
    function renderProducts(productList) {
        const grid = document.getElementById('productGrid');
        grid.innerHTML = '';

        productList.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <img src="https://placehold.co/300x200/E5E7EB/2F5BFF?text=${encodeURIComponent(product.name)}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-specs">
                        <span class="spec-tag">${product.wattage}</span>
                        <span class="spec-tag">${product.beamAngle}</span>
                        <span class="spec-tag">IP${product.ipRating}</span>
                    </div>
                    <p style="font-size: 0.9rem; color: #555; margin-bottom: 15px;">${product.description}</p>
                    <div class="product-actions">
                        <button class="btn-sm btn-config" onclick="openConfigurator('${product.name}')">Configure</button>
                        <button class="btn-sm btn-details">View Details</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Render Filters
    function renderFilters() {
        const filters = document.getElementById('productFilters');
        const categories = [...new Set(products.map(p => p.category))];
        
        let html = '<button class="filter-btn active" onclick="filterProducts(\'All\')">All</button>';
        categories.forEach(cat => {
            html += `<button class="filter-btn" onclick="filterProducts('${cat}')">${cat}</button>`;
        });
        filters.innerHTML = html;
    }

    // Filter Products
    window.filterProducts = function(category) {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        if (category === 'All') {
            filteredProducts = products;
        } else {
            filteredProducts = products.filter(p => p.category === category);
        }
        renderProducts(filteredProducts);
    };

    // Configurator Modal
    const modal = document.getElementById('configuratorModal');
    const closeModal = document.querySelector('.close-modal');
    const configProductTitle = document.getElementById('configProductTitle');
    const configSummary = document.getElementById('configSummary');

    window.openConfigurator = function(productName) {
        configProductTitle.textContent = `Configure: ${productName}`;
        modal.style.display = 'block';
        updateConfigSummary();
    };

    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Configurator Options
    document.getElementById('optWattage').addEventListener('change', updateConfigSummary);
    document.getElementById('optBeam').addEventListener('change', updateConfigSummary);
    document.getElementById('optLens').addEventListener('change', updateConfigSummary);
    document.getElementById('optColor').addEventListener('change', updateConfigSummary);

    function updateConfigSummary() {
        const wattage = document.getElementById('optWattage').value;
        const beam = document.getElementById('optBeam').value;
        const lens = document.getElementById('optLens').value;
        const color = document.getElementById('optColor').value;

        configSummary.innerHTML = `
            <li>Power: ${wattage}</li>
            <li>Beam: ${beam}</li>
            <li>Lens: ${lens}</li>
            <li>Housing: ${color}</li>
        `;
    }

    // Search Functionality
    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = prompt('Search products:');
        if (query) {
            const results = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
            renderProducts(results);
        }
    });

    // Cart Functionality
    document.getElementById('cartBtn').addEventListener('click', () => {
        alert('Cart feature coming soon!');
    });

    // Mobile Menu
    document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
        const nav = document.querySelector('.main-nav');
        if (nav.style.display
            : 'block') {
            nav.style.display = 'none';
        } else {
            nav.style.display = 'block';
        }
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });
});
