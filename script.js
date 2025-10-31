let formations = [];

// Charger les données depuis formations.json
fetch('formations.json')
    .then(response => response.json())
    .then(data => {
        formations = data;
        renderFormations(formations);
    })
    .catch(error => {
        console.error('Erreur de chargement des formations:', error);
    });

function renderFormations(filteredFormations) {
    const grid = document.getElementById('formationsGrid');
    grid.innerHTML = '';

    filteredFormations.forEach(formation => {
        const card = document.createElement('div');
        card.className = `formation-card category-${formation.category}`;
        card.innerHTML = `
            <div class="formation-header">
                <h3 class="formation-title">${formation.title}</h3>
                <div class="formation-meta">
                    <span class="badge badge-duration">⏱️ ${formation.duration}</span>
                    <span class="badge badge-level">📊 ${formation.level}</span>
                </div>
            </div>
            
            <div class="formation-section">
                <h4>🎯 Objectifs</h4>
                <p>${formation.objectifs}</p>
            </div>

            <div class="formation-section">
                <h4>👥 Public visé</h4>
                <p>${formation.public}</p>
            </div>

            <div class="formation-section">
                <h4>📋 Prérequis</h4>
                <p>${formation.prerequis}</p>
            </div>

            <div class="formation-section">
                <h4>🎓 Modalités</h4>
                <p>${formation.modalites}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterFormations(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter formations
    const filtered = category === 'all' 
        ? formations 
        : formations.filter(f => f.category === category);
    
    renderFormations(filtered);
}

document.getElementById('formulaire-contact').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const button = this.querySelector('.submit-btn');
    const messageDiv = this.querySelector('.form-message');
    
    // Récupérer les données
    const formData = {
        nom: document.getElementById('nom').value,
        email: document.getElementById('email').value,
        telephone: document.getElementById('telephone').value,
        entreprise: document.getElementById('entreprise').value,
        formation: document.getElementById('formation').value,
        message: document.getElementById('message').value,
        date: new Date().toLocaleString('fr-FR')
    };
    
    // Désactiver le bouton pendant l'envoi
    button.disabled = true;
    button.textContent = 'Envoi en cours...';
    messageDiv.textContent = '';
    
    try {
        // Option 1 : Envoyer vers Formspree (gratuit, fiable)
        const response = await fetch('https://formspree.io/f/myzbnagd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            messageDiv.textContent = '✅ Merci ! Votre demande a été envoyée. Nous vous répondrons sous 24h.';
            messageDiv.classList.add('success');
            this.reset();
        } else {
            throw new Error('Erreur lors de l\'envoi');
        }
    } catch (error) {
        messageDiv.textContent = '⚠️ Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.';
        messageDiv.classList.add('error');
        console.error('Erreur:', error);
    } finally {
        button.disabled = false;
        button.textContent = 'Envoyer ma demande';
    }
});
