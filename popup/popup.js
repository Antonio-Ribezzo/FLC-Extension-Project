document.addEventListener('DOMContentLoaded', function() {
  const analyzeButton = document.getElementById('analyzeButton');
  const loadingElement = document.getElementById('loading');
  const reportContainer = document.getElementById('report');
  
  analyzeButton.addEventListener('click', function() {
      // Mostro l'icona di caricamento
      loadingElement.style.display = 'block';
      // Nascondo il container del report
      reportContainer.style.display = 'none';
      // Nascondo il pulsante analizza 
      analyzeButton.style.display = 'none';
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
          // console.log("Messaggio ricevuto:", message.report);
          displayReport(message.report);

          // Nascondo l'icona di caricamento, mostro il report e il pulsante "analizza"
          loadingElement.style.display = 'none';
          reportContainer.style.display = 'block';
          analyzeButton.style.display = 'block';
      }
  });
});

function displayReport(report) {
  const reportContainer = document.getElementById('report');
  reportContainer.innerHTML = JSON.stringify(report, null, 2);
}