// Funzione per valutare il criterio di successo 1.1.1 Non-text Content
function evaluateNonTextContent() {
    const nonTextElements = [];
    let passedChecks = 0;

    // Selezioniamo tutti gli elementi non testuali
    nonTextElements.push(...document.querySelectorAll('img, area, input[type="image"], object, embed, applet'));

    // Valutiamo ciascun elemento
    nonTextElements.forEach(element => {
        if (element.tagName.toLowerCase() === 'img') {
            if (element.hasAttribute('alt') && element.getAttribute('alt').trim() !== "") {
                passedChecks++;
            }
        } else if (element.tagName.toLowerCase() === 'area') {
            if (element.hasAttribute('alt') && element.getAttribute('alt').trim() !== "") {
                passedChecks++;
            }
        } else if (element.tagName.toLowerCase() === 'input' && element.type === 'image') {
            if (element.hasAttribute('alt') && element.getAttribute('alt').trim() !== "") {
                passedChecks++;
            }
        } else if (element.tagName.toLowerCase() === 'object') {
            if ((element.hasAttribute('title') && element.getAttribute('title').trim() !== "") ||
                (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== "")) {
                passedChecks++;
            }
        } else if (element.tagName.toLowerCase() === 'embed') {
            if ((element.hasAttribute('title') && element.getAttribute('title').trim() !== "") ||
                (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== "")) {
                passedChecks++;
            }
        } else if (element.tagName.toLowerCase() === 'applet') {
            if (element.hasAttribute('alt') && element.getAttribute('alt').trim() !== "") {
                passedChecks++;
            }
        }
    });

    // Calcolare la percentuale di successo
    const successRate = (passedChecks / nonTextElements.length) * 100;
    return successRate >= 100;
}


// Funzione per generare il JSON finale
function generateAccessibilityReport() {
    const report = {
        "guidelines": {
            "Perceivable": {
                "1.1 Text Alternatives": {
                    "1.1.1 Non-text Content": evaluateNonTextContent() ? "verified" : "not verified"
                },
                "1.3 Adaptable": {
                    // Aggiungi qui le funzioni di valutazione per gli altri criteri
                    "1.3.1 Info and Relationships": "",
                    "1.3.2 Meaningful Sequence": "",
                    "1.3.4 Orientation": "",
                    "1.3.5 Identify Input Purpose": "",
                    "1.3.6 Identify Purpose": ""
                },
                "1.4 Distinguishable": {
                    // Aggiungi qui le funzioni di valutazione per gli altri criteri
                    "1.4.2 Audio Control": "",
                    "1.4.3 Contrast (Minimum)": "",
                    "1.4.6 Contrast (Enhanced)": "",
                    "1.4.10 Reflow": "verified",
                    "1.4.11 Non-text Contrast": "",
                    "1.4.12 Text Spacing": "",
                    "1.4.13 Content on Hover or Focus": ""
                }
            },
            "Operable": {
                "2.4 Navigable": {
                    // Aggiungi qui le funzioni di valutazione per gli altri criteri
                    "2.4.2 Page Titled": "",
                    "2.4.10 Section Headings": ""
                }
            },
            "Understandable": {
                "3.1 Readable": {
                    // Aggiungi qui le funzioni di valutazione per gli altri criteri
                    "3.1.1 Language of Page": "",
                    "3.1.2 Language of Parts": ""
                },
                "3.3 Input Assistance": {
                    // Aggiungi qui le funzioni di valutazione per gli altri criteri
                    "3.3.2 Labels or Instructions": "",
                    "3.3.8 Accessible Authentication (Minimum)": ""
                }
            },
            "Robust": {
                "4.1 Compatible": {
                    // Aggiungi qui le funzioni di valutazione per gli altri criteri
                    "4.1.2 Name, Role, Value": ""
                }
            }
        }
    };
    return report;
}


// Listener per i messaggi ricevuti dal popup (qui viene gestita la comunicazione tra popup.js e content_script.js)
browser.runtime.onMessage.addListener(function(message) {
    if (message.command === "analyze") {
        const accessibilityReport = generateAccessibilityReport();
        console.log(accessibilityReport);
        // Invia il rapporto al popup per la visualizzazione
        browser.runtime.sendMessage({ report: accessibilityReport });
    }
});