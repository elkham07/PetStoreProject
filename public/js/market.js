let basket = JSON.parse(localStorage.getItem('basket') || '[]');

export async function renderMarket() {
    let products = [];
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/products', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            products = await response.json();
        }
    } catch (e) {
        console.error(e);
    }

    if (!products) products = [];

    const productCards = products.length > 0 ? products.map(product => `
        <div class="card">
            <h3>${product.name}</h3>
            <p>${product.description || 'No description'}</p>
            <p><strong>Price:</strong> ${product.price} KZT</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <p><strong>Category:</strong> ${product.category || 'General'}</p>
            <button class="btn add-to-basket-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Basket</button>
        </div>
    `).join('') : '<p>No products available.</p>';

    const basketCount = basket.reduce((sum, item) => sum + item.quantity, 0);

    return `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h1>Marketplace</h1>
            <div style="display: flex; gap: 1rem;">
                <button id="view-basket-btn" class="btn" style="background-color: #10B981;">🛒 Basket (${basketCount})</button>
                <a href="#/stock" class="btn" style="background-color: #6B7280;">Manage Stock</a>
            </div>
        </div>

        <div class="grid">
            ${productCards}
        </div>
    `;
}

export function attachMarketListeners() {
    const addButtons = document.querySelectorAll('.add-to-basket-btn');
    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);

            const existing = basket.find(item => item.id === id);
            if (existing) {
                existing.quantity++;
            } else {
                basket.push({ id, name, price, quantity: 1 });
            }
            localStorage.setItem('basket', JSON.stringify(basket));
            alert(`${name} added to basket!`);
            location.reload();
        });
    });

    const viewBasketBtn = document.getElementById('view-basket-btn');
    if (viewBasketBtn) {
        viewBasketBtn.addEventListener('click', () => {
            showBasketModal();
        });
    }
}

function showBasketModal() {
    const total = basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const items = basket.map(item => `
        <div style="display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid #E5E7EB;">
            <span>${item.name} x${item.quantity}</span>
            <span>${item.price * item.quantity} KZT</span>
        </div>
    `).join('');

    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';
    modal.innerHTML = `
        <div class="card" style="max-width: 500px; width: 90%;">
            <h2>Your Basket</h2>
            ${basket.length > 0 ? items : '<p>Basket is empty.</p>'}
            ${basket.length > 0 ? `<p style="margin-top: 1rem;"><strong>Total: ${total} KZT</strong></p>` : ''}
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                ${basket.length > 0 ? '<button id="checkout-btn" class="btn">Checkout</button>' : ''}
                <button id="clear-basket-btn" class="btn" style="background-color: #EF4444;">Clear Basket</button>
                <button id="close-modal-btn" class="btn" style="background-color: #6B7280;">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('close-modal-btn').addEventListener('click', () => modal.remove());

    const clearBtn = document.getElementById('clear-basket-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            basket = [];
            localStorage.setItem('basket', JSON.stringify(basket));
            modal.remove();
            location.reload();
        });
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            const orderData = {
                user_id: localStorage.getItem('user_id'),
                items: basket.map(item => ({
                    product_id: item.id,
                    name: item.name,
                    price_at_purchase: item.price,
                    quantity: item.quantity
                }))
            };

            try {
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(orderData)
                });
                if (res.ok) {
                    basket = [];
                    localStorage.setItem('basket', JSON.stringify(basket));
                    alert('Order placed successfully!');
                    modal.remove();
                    location.reload();
                } else {
                    alert('Failed to place order');
                }
            } catch (e) {
                console.error(e);
            }
        });
    }
}
