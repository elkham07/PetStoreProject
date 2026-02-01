import { renderPassport, attachPassportListeners } from './passport.js';
import { renderMarket, attachMarketListeners } from './market.js';
import { renderLogin, attachLoginListeners, renderRegister, attachRegisterListeners } from './login.js';
import { renderTelehealth, attachTelehealthListeners } from './telehealth.js';
import { renderStock, attachStockListeners } from './stock.js';
import { renderProfile, attachProfileListeners } from './profile.js';

const routes = {
    '/': renderHome,
    '/passport': renderPassport,
    '/market': renderMarket,
    '/stock': renderStock,
    '/profile': renderProfile,
    '/telehealth': renderTelehealth,
    '/login': renderLogin,
    '/register': renderRegister
};

const router = async () => {
    try {
        console.log('Router called, hash:', window.location.hash);
        const content = document.getElementById('router-view');
        if (!content) {
            console.error('router-view element not found!');
            return;
        }

        const hash = window.location.hash.slice(1) || '/';
        console.log('Parsed hash:', hash);

        const renderFn = routes[hash] || renderHome;
        console.log('Render function:', renderFn.name);

        const token = localStorage.getItem('token');
        const publicRoutes = ['/', '/login', '/register'];

        if (!token && !publicRoutes.includes(hash)) {
            console.log('No token, redirecting to login');
            window.location.hash = '/login';
            return;
        }

        updateNav(hash, token);

        console.log('Calling render function...');
        const html = await renderFn();
        console.log('Render function returned, setting innerHTML');
        content.innerHTML = html;
        console.log('Content updated successfully');

        if (hash === '/passport') attachPassportListeners();
        else if (hash === '/market') attachMarketListeners();
        else if (hash === '/stock') attachStockListeners();
        else if (hash === '/profile') attachProfileListeners();
        else if (hash === '/login') attachLoginListeners();
        else if (hash === '/register') attachRegisterListeners();
        else if (hash === '/telehealth') attachTelehealthListeners();

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                localStorage.removeItem('role');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_name');
                window.location.reload();
            }
        }
    } catch (error) {
        console.error('Router error:', error);
        alert('Navigation error: ' + error.message);
    }
};

function updateNav(hash, token) {
    const nav = document.querySelector('nav');
    if (token) {
        nav.innerHTML = `
            <a href="#/" class="nav-link ${hash === '/' ? 'active' : ''}">Home</a>
            <a href="#/passport" class="nav-link ${hash === '/passport' ? 'active' : ''}">Passport</a>
            <a href="#/market" class="nav-link ${hash === '/market' ? 'active' : ''}">Market</a>
            <a href="#/telehealth" class="nav-link ${hash === '/telehealth' ? 'active' : ''}">Telehealth</a>
            <a href="#/profile" class="nav-link ${hash === '/profile' ? 'active' : ''}">Profile</a>
            <a href="#" id="logout-btn" class="nav-link">Logout</a>
        `;
    } else {
        nav.innerHTML = `
            <a href="#/" class="nav-link ${hash === '/' ? 'active' : ''}">Home</a>
            <a href="#/login" class="nav-link ${hash === '/login' ? 'active' : ''}">Login</a>
            <a href="#/register" class="nav-link ${hash === '/register' ? 'active' : ''}">Register</a>
        `;
    }
}

console.log('App.js loaded, setting up event listeners');
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

async function renderHome() {
    return `
        <div class="hero">
            <h1>Welcome to Zhailau Ecosystem</h1>
            <p>Integrated Digital Platform for Livestock & Veterinary Commerce</p>
            ${localStorage.getItem('token') ? `
                <div style="display: flex; justify-content: center; gap: 1rem;">
                    <a href="#/passport" class="btn">Manage Animals</a>
                    <a href="#/market" class="btn" style="background-color: var(--secondary-color);">Go to Market</a>
                </div>
            ` : `
                <div style="display: flex; justify-content: center; gap: 1rem;">
                    <a href="#/login" class="btn">Login</a>
                    <a href="#/register" class="btn" style="background-color: var(--secondary-color);">Register</a>
                </div>
            `}
        </div>
        <div class="grid">
            <div class="card">
                <h3>Traceability</h3>
                <p>ISO 11784/11785 Compliant Digital Passports.</p>
            </div>
            <div class="card">
                <h3>Marketplace</h3>
                <p>Buy and sell verified livestock.</p>
            </div>
            <div class="card">
                <h3>Telehealth</h3>
                <p>Instant access to veterinary professionals.</p>
            </div>
        </div>
    `;
}
