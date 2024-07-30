document.addEventListener('DOMContentLoaded', function() {
  const analyzeButton = document.getElementById('analyzeButton');
  
  analyzeButton.addEventListener('click', function() {
      // Invia un messaggio al content script per iniziare l'analisi
      // Questa parte del codice utilizza l’API del browser per inviare un messaggio al content script dell’estensione. 
      // browser.tabs.query ottiene la scheda attiva nella finestra corrente, quindi browser.tabs.sendMessage invia un messaggio con il comando analyze al content script di quella scheda.
      browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
          browser.tabs.sendMessage(tabs[0].id, {command: "analyze"});
      });
  });
  
  // Riceve il rapporto dal content script e lo visualizza
  browser.runtime.onMessage.addListener(function(message) {
      if (message.report) {
          displayReport(message.report);
      }
  });
});

function displayReport(report) {
  const reportContainer = document.getElementById('report');
  reportContainer.innerHTML = JSON.stringify(report, null, 2);
}