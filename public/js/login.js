export async function renderLogin() {
    return `
        <div class="card" style="max-width: 400px; margin: 2rem auto;">
            <h2 style="text-align: center; margin-bottom: 1.5rem;">Login to Zhailau</h2>
            <form id="login-form">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" class="form-control" required>
                </div>
                <button type="submit" class="btn" style="width: 100%;">Login</button>
            </form>
            <p style="text-align: center; margin-top: 1rem;">
                Don't have an account? <a href="#/register">Register</a>
            </p>
        </div>
    `;
}

export function attachLoginListeners() {
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    const json = await res.json();
                    localStorage.setItem('token', json.token);
                    localStorage.setItem('user_id', json.user_id);
                    localStorage.setItem('role', json.role || 'USER');
                    localStorage.setItem('user_email', json.email);
                    localStorage.setItem('user_name', json.name);
                    alert('Login successful!');
                    window.location.hash = '/';
                } else {
                    alert('Login failed');
                }
            } catch (err) {
                console.error(err);
                alert('Connection error');
            }
        });
    }
}

export async function renderRegister() {
    return `
        <div class="card" style="max-width: 400px; margin: 2rem auto;">
            <h2 style="text-align: center; margin-bottom: 1.5rem;">Register</h2>
            <form id="register-form">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select name="role" class="form-control">
                        <option value="owner">Livestock Owner</option>
                        <option value="vet">Veterinarian</option>
                    </select>
                </div>
                <button type="submit" class="btn" style="width: 100%;">Register</button>
            </form>
            <p style="text-align: center; margin-top: 1rem;">
                Already have an account? <a href="#/login">Login</a>
            </p>
        </div>
    `;
}

export function attachRegisterListeners() {
    const form = document.getElementById('register-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    alert('Registration successful! Please login.');
                    window.location.hash = '/login';
                } else {
                    const txt = await res.text();
                    alert('Registration failed: ' + txt);
                }
            } catch (err) {
                console.error(err);
                alert('Connection error');
            }
        });
    }
}
