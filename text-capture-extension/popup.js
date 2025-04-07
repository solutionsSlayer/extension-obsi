document.addEventListener('DOMContentLoaded', function() {
  // Récupérer le style enregistré précédemment et définir la valeur par défaut
  chrome.storage.sync.get('noteStyle', function(data) {
    if (data.noteStyle) {
      document.getElementById('style-select').value = data.noteStyle;
    }
  });

  // Enregistrer le style sélectionné lorsqu'il change
  document.getElementById('style-select').addEventListener('change', function() {
    const selectedStyle = this.value;
    chrome.storage.sync.set({ 'noteStyle': selectedStyle }, function() {
      showStatus('Style enregistré: ' + selectedStyle, 'success');
    });
  });

  // Fonction pour afficher les statuts
  function showStatus(message, type) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = 'status ' + type;
    
    // Masquer le message après 3 secondes
    setTimeout(() => {
      statusEl.className = 'status';
    }, 3000);
  }

  // Vérifier si le serveur MCP est joignable
  fetch('http://localhost:3000/health')
    .then(response => {
      if (response.ok) {
        showStatus('Serveur MCP connecté', 'success');
      } else {
        showStatus('Serveur MCP non connecté', 'error');
      }
    })
    .catch(() => {
      showStatus('Serveur MCP non connecté', 'error');
    });
});
