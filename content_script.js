// 1.1.1 //
// Funzione per valutare il criterio di successo 1.1.1 Non-text Content
function evaluateNonTextContent() {
    const nonTextElements = [];
    let passedChecks = 0;

    // Seleziono tutti gli elementi non testuali
    nonTextElements.push(...document.querySelectorAll('img, input[type="image"], area, object, embed, svg'));
    
    // Valuto ciascun elemento
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

    // Calcolo la percentuale di successo
    const successRate = (passedChecks / nonTextElements.length) * 100;
    // Può essere true o false
    const limit = 90;
    if(successRate >= limit){
        console.log("DEBUG Criteria 1.1.1 \n\tAlmeno " +  limit +"% dei contenuti non testuali ha un'alternativa testuale")
        return true
    }else{
        console.log("DEBUG Criteria 1.1.1 \n\tPiù del " +  (100-limit) +"% dei contenuti non testuali non ha un'alternativa testuale")
        return false
    }
}

// 1.3.1 //
// Funzione per verificare il criterio di successo 1.3.1 Info and Relationships
function evaluateInfoAndRelationships(){
    let isVerified = true;
    // Verifica delle intestazioni
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6'); //sarà una node list
    headings.forEach(heading => {
        if(!heading.textContent.trim()){
            console.log("DEBUG Criteria 1.3.1 \n\tEsistono dei titoli (headings) che non hanno contenuto")
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
            console.log("DEBUG Criteria 1.3.1 \n\tEsistono dei campi input che non hanno nè un'etichetta (label) nè una attributo aria-labelledby")
            isVerified = false;
        }
    });

    // Verifica delle Tabelle
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const thElements = table.querySelectorAll('th');
        thElements.forEach(th => {
            if (!th.hasAttribute('scope') && !th.hasAttribute('id')) {
                console.log("DEBUG Criteria 1.3.1 \n\tEsistono delle tabelle con tag 'th' che sono senza attributo scope e/o attributo id")
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
                        console.log("DEBUG Criteria 1.3.1 \n\tEsistono delle tabelle con tag 'td' che non corrispondono ad alcun elemento")
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
            console.log("DEBUG Criteria 1.3.1 \n\tEsistono degli elenchi strutturati in modo errato")
            isVerified = false;
        }
    });

    // Verifica dell'uso degli attributi ARIA
    const ariaElements = document.querySelectorAll('[aria-labelledby], [aria-describedby]');
    ariaElements.forEach(element => {
        // ottengo il valore dell'attributo aria-labelledby dell'elemento corrente
        const ariaLabelledby = element.getAttribute('aria-labelledby');
        if (ariaLabelledby) {
            // Suddivido il valore dell’attributo aria-labelledby in un array di ID, utilizzando lo spazio come delimitatore.
            const labelledbyIds = ariaLabelledby.split(' ');
            // Itero su ciascun ID e verifico se esiste un elemento con quell’ID nel documento. 
            // Se un ID non corrisponde ad un elemento esistente, imposta isVerified a false.
            labelledbyIds.forEach(id => {
                if (!document.getElementById(id)) {
                    console.log("DEBUG Criteria 1.3.1 \n\tEsistono dei tag con attributi aria-labelledby non associati ad alcun elemento")
                    isVerified = false;
                }
            });
        }

        const ariaDescribedby = element.getAttribute('aria-describedby');
        if (ariaDescribedby) {
            const describedbyIds = ariaDescribedby.split(' ');
            describedbyIds.forEach(id => {
                if (!document.getElementById(id)) {
                    console.log("DEBUG Criteria 1.3.1 \n\tEsistono dei tag con attributi aria-describedby non associati ad alcun elemento")
                    isVerified = false;
                }
            });
        }
    });

    return isVerified
}

// 1.3.2 //
// Funzione per verificare il criterio di successo 1.3.2 Meaningful Sequence
function evaluateMeaningfulSequence(){
    let isVerified = true;

    const mainElements = document.querySelectorAll('header, nav, main, footer, section, article, h1, h2, h3, h4, h5, h6')
    let previousElementType = "";

    mainElements.forEach(element => {
        const  elementType= element.tagName.toLowerCase();

        if (!isOrderMeaningful(previousElementType, elementType)) {
            console.log("DEBUG Criteria 1.3.2 \n\tIl primo tag trovato è: " + previousElementType + "\n\tIl secondo tag trovato è: " + elementType + "\n\tL'ordine deve essere il seguente: header, nav, main, section, article, footer.")
            isVerified = false;
        }

        // Gestisco le intestazioni separatamente
        // Questa condizione verifica esplicitamente se il tipo di elemento è uno tra h1, h2, h3, h4, h5, h6.
        // il metodo .includes controlla se elementType è incluso in questo array.
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(elementType)) {
            if (!isHeadingOrderMeaningful(element)) {
                console.log("DEBUG Criteria 1.3.2 \n\tL'ordine dei titoli non è rispettato \n\tL'ordine deve essere il seguente: h1, h2, h3, h4, h5, h6")
                isVerified = false;
            }
        }
        previousElementType = elementType;
    });

    return isVerified
}

// Funzione di supporto per determinare se l'ordine tra due tipi di elementi è significativo
// La funzione isOrderMeaningful è utilizzata per determinare se l’ordine tra due tipi di elementi è significativo secondo una sequenza logica prestabilita.
// Questa funzione verifica se il tipo di elemento corrente viene dopo (o è lo stesso di) quello del tipo di elemento precedente in un ordine specificato.
function isOrderMeaningful(previousElementType, currentElementType) {
    const order = ['header', 'nav', 'main', 'section', 'article', 'footer'];
    const previousIndex = order.indexOf(previousElementType); // Se il tipo di elemento non è presente nell’array order, indexOf restituirà -1.
    const currentIndex = order.indexOf(currentElementType);

    if (currentIndex === -1 || previousIndex === -1) {
        return true; // Gli elementi che non sono nell'array "order" sono gestiti separatamente
    }

    return currentIndex >= previousIndex; // true o false
}

// Funzione per verificare l'ordine delle intestazioni all'interno del loro contenitore
function isHeadingOrderMeaningful(heading) {
    // Funzione per trovare il contenitore superiore significativo
    function findSignificantContainer(element) {
        let current = element.parentElement;
        while (current && !['div', 'section', 'article', 'main', 'header', 'nav', 'footer'].includes(current.tagName.toLowerCase())) {
            current = current.parentElement;
        }
        return current;
    }

    // Ottengo il contenitore significativo dell'heading corrente
    const container = findSignificantContainer(heading);
    if (!container) return true; // Se non viene trovato un contenitore significativo, considera l'ordine valido

    // Seleziono tutte le intestazioni nel contenitore
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    // Inizializzo la variabile per tracciare il livello dell'ultima intestazione
    let lastLevel = 0; // Inizializziamo lastLevel a 0 per gestire il primo heading

    // Iterazione su ciascuna intestazione nel contenitore
    for (const h of headings) {
        const level = parseInt(h.tagName.charAt(1)); // ad esempio 3

        // Se lastLevel è 0, significa che è il primo heading
        if (lastLevel === 0) {
            lastLevel = level;
            continue;
        }

        // Verifico che i titoli siano disposti in maniera incrementale
        if (level < lastLevel ){
            return false;
        }else if(level >= lastLevel){
            continue;
        }

        // Aggiorno lastLevel con il livello corrente
        lastLevel = level;
        // console.log(h, lastLevel, container);
    }

    // Se tutte le intestazioni sono in ordine sequenziale, restituisci true
    return true;
}


// 1.3.4 //
// Funzione per verificare il criterio di successo 1.3.4 Orientation
function evaluateOrientation() {
    let isVerified = true;

    // Verifico l'orientamento corrente del dispositivo utilizzando le proprietà delle media query
    const initialOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    // console.log(initialOrientation);
    // Definisco le media query per portrait e landscape
    const portraitQuery = window.matchMedia("(orientation: portrait)");
    // console.log("Portrait query: " + portraitQuery.media + ", Matches: " + portraitQuery.matches)
    const landscapeQuery = window.matchMedia("(orientation: landscape)");
    // console.log("Landscape query: " + landscapeQuery.media + ", Matches: " + landscapeQuery.matches)

    // Verifica se la media query per l'orientamento corrente è matches
    if ((initialOrientation === 'portrait' && !portraitQuery.matches) || (initialOrientation === 'landscape' && !landscapeQuery.matches)) {
        console.log("DEBUG Criteria 1.3.4 \n\tEsistono media query che bloccano l'orientamento")
        isVerified = false;
    }

    // Ispeziona tutti gli script nel documento per screen.orientation.lock
    document.querySelectorAll('script').forEach(script => {
        let lockDetected = false;
        if (script.textContent.includes('screen.orientation.lock')) {
            lockDetected = true;
            console.log('DEBUG Criteria 1.3.4 \n\tscreen.orientation.lock trovato nello script:', script.textContent);
        }
        if (lockDetected) {
            console.log("DEBUG Criteria 1.3.4 \n\tEsistono script che bloccano l'orientamento.");
            isVerified = false;
        }
    });

    return isVerified;
}

// 1.3.5 //
// Funzione per verificare il criterio di successo 1.3.5 Identify Input Purpose
function evaluateIdentifyInputPurpose() {
    let isVerified = true;
    const inputFields = document.querySelectorAll('input, textarea, select');

    inputFields.forEach(input => {
        const type = input.getAttribute('type');
        const autocomplete = input.getAttribute('autocomplete');
        
        // Check for valid input types and autocomplete attributes
        const validInputTypes = ['button','checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'];
        const validAutocompletes = [
            'off', 'on', 'name', 'honorific-prefix', 'given-name', 'additional-name', 
            'family-name', 'honorific-suffix', 'nickname', 'username', 
            'new-password', 'current-password', 'organization-title', 
            'organization', 'street-address', 'address-line1', 
            'address-line2', 'address-line3', 'address-level4', 
            'address-level3', 'address-level2', 'address-level1', 
            'country', 'country-name', 'postal-code', 'cc-name', 
            'cc-given-name', 'cc-additional-name', 'cc-family-name', 
            'cc-number', 'cc-exp', 'cc-exp-month', 'cc-exp-year', 
            'cc-csc', 'cc-type', 'transaction-currency', 
            'transaction-amount', 'language', 'bday', 'bday-day', 
            'bday-month', 'bday-year', 'sex', 'tel', 'tel-country-code', 
            'tel-national', 'tel-area-code', 'tel-local', 'tel-local-prefix', 
            'tel-local-suffix', 'tel-extension', 'impp', 'url', 'photo'
        ];

        if (type && !validInputTypes.includes(type)) {
            isVerified = false;
            console.log(`DEBUG Criteria 1.3.5 \n\tTrovato un input type non valido: ${type}`);
        }
        
        if (autocomplete && !validAutocompletes.includes(autocomplete)) {
            isVerified = false;
            console.log(`DEBUG Criteria 1.3.5 \n\tTrovato un attributo autocomplete non valido: ${autocomplete}`);
            console.log(`Invalid autocomplete attribute detected: ${autocomplete}`);
        }
    });

    return isVerified;
}

// Call the function to test
evaluateIdentifyInputPurpose();


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
                    "1.3.2 Meaningful Sequence": evaluateMeaningfulSequence() ? "verified" : "not verified",
                    "1.3.4 Orientation": evaluateOrientation() ? "verified" : "not verified",
                    "1.3.5 Identify Input Purpose": evaluateIdentifyInputPurpose() ? "verified" : "not verified",
                    "1.3.6 Identify Purpose": ""
                },
                "1.4 Distinguishable": {
                    // Aggiungi qui le funzioni di valutazione per gli altri criteri
                    "1.4.2 Audio Control": "",
                    "1.4.3 Contrast (Minimum)": "",
                    "1.4.6 Contrast (Enhanced)": "",
                    "1.4.10 Reflow": "",
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
        evaluateOrientation();
        // console.log(accessibilityReport);
        // console.log(evaluateInfoAndRelationships());
        // Invia il rapporto al popup per la visualizzazione
        browser.runtime.sendMessage({ report: accessibilityReport });
    }
});