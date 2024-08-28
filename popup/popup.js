document.addEventListener('DOMContentLoaded', function() {
  const analyzeButton = document.getElementById('analyzeButton');
  const loadingElement = document.getElementById('loading');
  const reportContainer = document.getElementById('report');
  const downloadButton = document.getElementById('downloadButton');
  
  analyzeButton.addEventListener('click', function() {
      // Mostro l'icona di caricamento
      loadingElement.style.display = 'block';
      // Nascondo il container del report
      reportContainer.style.display = 'none';
      // Nascondo il pulsante analizza 
      analyzeButton.style.display = 'none';
      // Nascondo il pulsante di download
      downloadButton.style.display = 'none';
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
        downloadButton.style.display = 'block';

        // Crea un Blob con i dati JSON e avvia il download
        // Converte l'oggetto JSON in una stringa. Il secondo parametro null e il terzo parametro 2 sono usati per formattare il JSON con un'indentazione di 2 spazi per renderlo più leggibile.
        const jsonString = JSON.stringify(message.report, null, 2);
        // Crea un oggetto Blob contenente la stringa JSON. Il tipo application/json indica che il Blob contiene dati JSON.
        const blob = new Blob([jsonString], { type: 'application/json' });
        // Crea un URL temporaneo che punta al Blob. Questo URL può essere utilizzato per scaricare il Blob come file.
        const url = URL.createObjectURL(blob);

        // Configura il pulsante di download
        // Imposta l'attributo href del pulsante di download all'URL creato per il Blob. Questo URL è utilizzato come destinazione del download.
        downloadButton.href = url;
        // Imposta l'attributo download del pulsante di download. Quando l'utente clicca sul pulsante, il file verrà scaricato con il nome specificato (accessibility_report.json).
        downloadButton.download = 'accessibility_report.json';
      }
  });
  function displayReport(report) {
    const reportContainer = document.getElementById('report');
    reportContainer.innerHTML = JSON.stringify(report, null, 2);
  }
});

