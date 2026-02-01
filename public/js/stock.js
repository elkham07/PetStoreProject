export async function renderStock() {
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

    const productList = products.length > 0 ? products.map(product => `
        <div class="card">
            <h3>${product.name}</h3>
            <p>${product.description || 'No description'}</p>
            <p><strong>Price:</strong> ${product.price} KZT</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <p><strong>Category:</strong> ${product.category || 'General'}</p>
        </div>
    `).join('') : '<p>No products in stock.</p>';

    return `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h1>Stock Management</h1>
            <button id="add-product-btn" class="btn">Add Product</button>
        </div>

        <div id="add-product-form" class="card" style="display: none; margin-bottom: 2rem;">
            <h3>Add New Product</h3>
            <form id="product-form">
                <div class="form-group">
                    <label>Product Name</label>
                    <input type="text" name="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" class="form-control" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Price (KZT)</label>
                    <input type="number" name="price" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Stock Quantity</label>
                    <input type="number" name="stock" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <input type="text" name="category" class="form-control" placeholder="e.g., Feed, Medicine">
                </div>
                <div class="form-group">
                    <label>Image URL (optional)</label>
                    <input type="text" name="image_url" class="form-control">
                </div>
                <button type="submit" class="btn">Save Product</button>
            </form>
        </div>

        <div class="grid">
            ${productList}
        </div>
    `;
}

export function attachStockListeners() {
    const btn = document.getElementById('add-product-btn');
    const formDiv = document.getElementById('add-product-form');
    const form = document.getElementById('product-form');

    if (btn) {
        btn.addEventListener('click', () => {
            formDiv.style.display = formDiv.style.display === 'none' ? 'block' : 'none';
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {
                seller_id: localStorage.getItem('user_id'),
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock')),
                category: formData.get('category'),
                image_url: formData.get('image_url')
            };

            try {
                const res = await fetch('/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    alert('Product added successfully!');
                    location.reload();
                } else {
                    const txt = await res.text();
                    alert('Error: ' + txt);
                }
            } catch (err) {
                console.error(err);
                alert('Failed to connect to server');
            }
        });
    }
}
