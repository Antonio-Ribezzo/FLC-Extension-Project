// Funzione per valutare il criterio di successo 1.1.1 Non-text Content
function evaluateNonTextContent() {
    const nonTextElements = [];
    let passedChecks = 0;

    // Selezioniamo tutti gli elementi non testuali
    nonTextElements.push(...document.querySelectorAll('img, input[type="image"], area, object, embed, svg'));
    
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
            if ((element.hasAttribute('alt') && element.getAttribute('alt').trim() !== "") || 
                (element.hasAttribute('title') && element.getAttribute('title').trim() !== "") ||
                (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== "") || 
                (element.hasAttribute('aria-labelledby') && element.getAttribute('aria-labelledby').trim() !== "")) {
                passedChecks++;
            }
        } else if (element.tagName.toLowerCase() === 'object') {
            if ((element.hasAttribute('title') && element.getAttribute('title').trim() !== "") ||
                (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== "") ||
                (element.hasAttribute('aria-labelledby') && element.getAttribute('aria-labelledby').trim() !== "")){
                passedChecks++;
            }
        } else if (element.tagName.toLowerCase() === 'embed') {
            if ((element.hasAttribute('title') && element.getAttribute('title').trim() !== "") ||
                (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== "")) {
                passedChecks++;
            }
        }else if (element.tagName.toLowerCase() === 'svg' && element.hasAttribute('role') && element.getAttribute('role').trim() !== "") {
            if (
                (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== "") ||
                (element.hasAttribute('aria-labelledby') && element.getAttribute('aria-labelledby').trim() !== "") ||
                (element.hasAttribute('title') && element.getAttribute('title').trim() !== "")
            ) {
                passedChecks++;
            }
        }   
    });

    // Calcolare la percentuale di successo
    const successRate = (passedChecks / nonTextElements.length) * 100;
    // Può essere true o false
    return successRate >= 90;
}

// Funzione per verificare il criterio di successo 1.3.1 Info and Relationships
function evaluateInfoAndRelationships(){
    let isVerified = true;
    // Verifica delle intestazioni
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6'); //sarà una node list
    headings.forEach(heading => {
        if(!heading.textContent.trim()){
            isVerified = false;
        }
    })

    // Verifica delle Etichette dei Moduli
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        // Se tutte queste condizioni sono vere, significa che l’elemento di input non ha alcuna etichetta o descrizione accessibile
        // quindi la variabile isVerified viene impostata su false.
        if (!label && !input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
            isVerified = false;
        }
    });

    // Verifica delle Tabelle
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const thElements = table.querySelectorAll('th');
        thElements.forEach(th => {
            if (!th.hasAttribute('scope') && !th.hasAttribute('id')) {
                isVerified = false;
            }
        });

        const tdElements = table.querySelectorAll('td');
        tdElements.forEach(td => {
            if (td.hasAttribute('headers')) {
                //otteniamo l'elenco degli ID delle celle di intestazione associati
                const headerIds = td.getAttribute('headers').split(' ');
                // verifico che ogni ID corrisponda ad un elemento esistente
                headerIds.forEach(headerId => {
                    if (!document.getElementById(headerId)) {
                        isVerified = false;
                    }
                });
            }
        });
    });

    // Verifica degli Elenchi
    const lists = document.querySelectorAll('ul, ol, dl');
    lists.forEach(list => {
        if (!list.querySelectorAll('li, dt, dd').length) {
            isVerified = false;
        }
    });

    // Verifico dell'uso degli attributi ARIA
    const ariaElements = document.querySelectorAll('[aria-labelledby], [aria-describedby]');
    ariaElements.forEach(element => {
        // otteniamo il valore dell'attributo aria-labelledby dell'elemento corrente
        const ariaLabelledby = element.getAttribute('aria-labelledby');
        if (ariaLabelledby) {
            // Suddivido il valore dell’attributo aria-labelledby in un array di ID, utilizzando lo spazio come delimitatore.
            const labelledbyIds = ariaLabelledby.split(' ');
            // Itero su ciascun ID e verifico se esiste un elemento con quell’ID nel documento. 
            // Se un ID non corrisponde ad un elemento esistente, imposta isVerified a false.
            labelledbyIds.forEach(id => {
                if (!document.getElementById(id)) {
                    isVerified = false;
                }
            });
        }

        const ariaDescribedby = element.getAttribute('aria-describedby');
        if (ariaDescribedby) {
            const describedbyIds = ariaDescribedby.split(' ');
            describedbyIds.forEach(id => {
                if (!document.getElementById(id)) {
                    isVerified = false;
                }
            });
        }
    });

    return isVerified
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
                    "1.3.1 Info and Relationships": evaluateInfoAndRelationships() ? "verified" : "not verified",
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
        // console.log(evaluateInfoAndRelationships());
        // Invia il rapporto al popup per la visualizzazione
        browser.runtime.sendMessage({ report: accessibilityReport });
    }
});