// Créer le menu contextuel lors de l'installation de l'extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "capture-text",
    title: "Capturer pour Obsidian",
    contexts: ["selection"]
  });

  // Stocker le style par défaut
  chrome.storage.sync.set({ 'noteStyle': 'concis' });
});

// Gérer les clics sur le menu contextuel
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "capture-text" && info.selectionText) {
    // Récupérer le style choisi
    chrome.storage.sync.get('noteStyle', function(data) {
      const selectedStyle = data.noteStyle || 'concis';
      
      // Envoyer le texte sélectionné et le style au serveur local MCP
      sendToServer(info.selectionText, selectedStyle, tab);
    });
  }
});

// Fonction pour envoyer le texte au serveur MCP local
function sendToServer(text, style, tab) {
  fetch('http://localhost:3000/capture', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      style: style,
      source: tab.url,
      title: tab.title
    })
  })
  .then(response => response.json())
  .then(data => {
    // Notifier l'utilisateur du succès ou de l'échec
    if (data.success) {
      notifyUser("Texte capturé avec succès!", "success");
    } else {
      notifyUser("Erreur lors de la capture: " + data.message, "error");
    }
  })
  .catch(error => {
    notifyUser("Erreur de connexion au serveur MCP. Assurez-vous qu'il est en cours d'exécution.", "error");
    console.error('Erreur:', error);
  });
}

// Fonction pour notifier l'utilisateur
function notifyUser(message, type) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: type === 'success' ? 'icons/icon48.png' : 'icons/icon48.png',
    title: type === 'success' ? 'Succès' : 'Erreur',
    message: message
  });
}
