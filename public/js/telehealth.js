export async function renderTelehealth() {
    return `
        <div class="card" style="max-width: 600px; margin: 2rem auto; height: 500px; display: flex; flex-direction: column;">
            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2>Veterinary Consultation (Live)</h2>
                    <p>Status: <span id="ws-status" style="color: red;">Disconnected</span></p>
                </div>
                <button id="toggle-role-btn" class="btn" style="background-color: #6B7280; font-size: 0.8rem;">Switch to Vet View (Test)</button>
            </div>
            
            <div id="chat-messages" style="flex: 1; overflow-y: auto; border: 1px solid var(--border-color); padding: 1rem; margin-bottom: 1rem; border-radius: var(--radius); background: #f9f9f9;">
            </div>

            <form id="chat-form" style="display: flex; gap: 0.5rem;">
                <input type="text" id="chat-input" class="form-control" placeholder="Type your message..." required>
                <button type="submit" class="btn">Send</button>
            </form>
        </div>
    `;
}

export function attachTelehealthListeners() {
    const statusSpan = document.getElementById('ws-status');
    const messagesDiv = document.getElementById('chat-messages');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const roleBtn = document.getElementById('toggle-role-btn');

    let currentRole = localStorage.getItem('role') || 'USER';

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/telehealth/ws?role=${currentRole}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        statusSpan.textContent = 'Connected as ' + currentRole;
        statusSpan.style.color = 'green';
        addMessage('System', `Connected to consultation service as ${currentRole}.`);
    };

    socket.onmessage = (event) => {
        addMessage('Server', event.data);
    };

    socket.onclose = () => {
        statusSpan.textContent = 'Disconnected';
        statusSpan.style.color = 'red';
        addMessage('System', 'Connection closed.');
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = input.value;
        if (msg && socket.readyState === WebSocket.OPEN) {
            socket.send(msg);
            addMessage('You', msg, true);
            input.value = '';
        }
    });

    if (roleBtn) {
        roleBtn.addEventListener('click', () => {
            const newRole = currentRole === 'USER' ? 'VET' : 'USER';
            localStorage.setItem('role', newRole);
            location.reload();
        });
    }

    function addMessage(sender, text, isSelf = false) {
        const msgDiv = document.createElement('div');
        msgDiv.style.marginBottom = '0.5rem';
        msgDiv.style.textAlign = isSelf ? 'right' : 'left';

        const content = document.createElement('span');
        content.style.display = 'inline-block';
        content.style.padding = '0.5rem 1rem';
        content.style.borderRadius = '1rem';
        content.style.background = isSelf ? 'var(--primary-color)' : '#E5E7EB';
        content.style.color = isSelf ? 'white' : 'var(--text-main)';
        content.textContent = `${sender}: ${text}`;

        msgDiv.appendChild(content);
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}
