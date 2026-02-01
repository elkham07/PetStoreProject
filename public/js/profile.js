export async function renderProfile() {
    let orders = [];
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            orders = await response.json();
        }
    } catch (e) {
        console.error(e);
    }

    if (!orders) orders = [];

    const userId = localStorage.getItem('user_id');
    const userEmail = localStorage.getItem('user_email') || 'Not available';
    const userName = localStorage.getItem('user_name') || 'User';

    const orderHistory = orders.length > 0 ? orders.map(order => `
        <div class="card">
            <div style="display:flex; justify-content:space-between;">
                <h3>Order #${order.id ? order.id.slice(-6) : '...'}</h3>
                <span class="tag">${order.status}</span>
            </div>
            <p>Total: <strong>${order.total_price} KZT</strong></p>
            <p>Items: ${order.items ? order.items.length : 0}</p>
            <p style="font-size: 0.8rem; color: #6B7280;">Placed: ${new Date(order.created_at).toLocaleDateString()}</p>
        </div>
    `).join('') : '<p>No orders yet.</p>';

    return `
        <div style="margin-bottom: 2rem;">
            <h1>My Profile</h1>
        </div>

        <div class="card" style="margin-bottom: 2rem;">
            <h3>Account Information</h3>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>User ID:</strong> ${userId}</p>
        </div>

        <div style="margin-bottom: 1rem;">
            <h2>Order History</h2>
        </div>

        <div class="grid">
            ${orderHistory}
        </div>
    `;
}

export function attachProfileListeners() {
}
