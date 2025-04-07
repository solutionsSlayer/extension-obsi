// Suivre l'élément actuellement survolé
let hoveredElement = null;
let hoveredText = '';

// Écouter les événements de survol
document.addEventListener('mouseover', function(event) {
  // Stocker l'élément survolé
  hoveredElement = event.target;
  
  // Stocker le texte de l'élément survolé s'il contient du texte
  if (hoveredElement.textContent && hoveredElement.textContent.trim().length > 0) {
    hoveredText = hoveredElement.textContent.trim();
  }
});

// Écouter les messages du script background
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getHoveredText") {
    sendResponse({ text: hoveredText });
  }
});
