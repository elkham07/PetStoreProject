export async function renderPassport() {
    let animals = [];
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/animals', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            animals = await response.json();
        }
    } catch (e) {
        console.error("Failed to fetch animals", e);
    }

    if (!animals) animals = [];

    const animalCards = animals.length > 0 ? animals.map(animal => `
        <div class="card" onclick="alert('Details for ${animal.rfid_tag}')">
            <span class="tag">${animal.type}</span> <span class="tag" style="background:#FEF3C7; color:#D97706;">${animal.breed}</span>
            <h3>${animal.rfid_tag}</h3>
            <p><strong>Owner ID:</strong> ${animal.owner_id}</p>
            <p>${animal.medical_history ? animal.medical_history.length : 0} Medical Records</p>
        </div>
    `).join('') : '<p>No animals registered yet.</p>';

    return `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h1>Digital Passports</h1>
            <button id="add-animal-btn" class="btn">Register Animal</button>
        </div>

        <div id="add-animal-form" class="card" style="display: none; margin-bottom: 2rem;">
            <h3>Register New Animal</h3>
            <form id="animal-form">
                <div class="form-group">
                    <label>RFID Tag</label>
                    <input type="text" name="rfid_tag" class="form-control" required placeholder="KAZ-xxxx-yyyy">
                </div>
                <div class="form-group">
                    <label>Type</label>
                    <select name="type" class="form-control">
                        <option value="HORSE">Horse</option>
                        <option value="COW">Cow</option>
                        <option value="SHEEP">Sheep</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Breed</label>
                    <input type="text" name="breed" class="form-control" required>
                </div>
                <!-- Owner ID is handled automatically -->
                <button type="submit" class="btn">Save Passport</button>
            </form>
        </div>

        <div class="grid">
            ${animalCards}
        </div>
    `;
}

export function attachPassportListeners() {
    const btn = document.getElementById('add-animal-btn');
    const formDiv = document.getElementById('add-animal-form');
    const form = document.getElementById('animal-form');

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
                rfid_tag: formData.get('rfid_tag'),
                type: formData.get('type'),
                breed: formData.get('breed'),
                owner_id: localStorage.getItem('user_id')
            };

            try {
                const res = await fetch('/api/animals', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    alert('Animal registered successfully!');
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
