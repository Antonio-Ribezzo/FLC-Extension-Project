// 1.1.1 //
// Funzione per valutare il criterio di successo 1.1.1 Non-text Content
function evaluateNonTextContent() {
    const nonTextElements = [];
    let passedChecks = 0;

    // Seleziono tutti gli elementi non testuali
    nonTextElements.push(...document.querySelectorAll('img, input[type="image"], area, object, embed, svg, audio, video'));
    // console.log(nonTextElements)
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
        }else if (element.tagName.toLowerCase() === 'audio') {
            if (
                (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== "") ||
                (element.hasAttribute('aria-labelledby') && element.getAttribute('aria-labelledby').trim() !== "") ||
                (element.hasAttribute('title') && element.getAttribute('title').trim() !== "")
            ) {
                passedChecks++;
            }
        }else if (element.tagName.toLowerCase() === 'video') {
            if (
                (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() !== "") ||
                (element.hasAttribute('aria-labelledby') && element.getAttribute('aria-labelledby').trim() !== "") ||
                (element.hasAttribute('title') && element.getAttribute('title').trim() !== "")
            ) {
                passedChecks++;
            }
        }
    });

    if(nonTextElements.length === 0){
        return true
    }else{
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
            console.log("DEBUG Criteria 1.3.1 \n\tEsistono dei campi input che non hanno nè un'etichetta (label) nè un attributo aria-labelledby")
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
// 2.4.10
// Funzione per verificare il criterio di successo 2.4.10 "Section Headings"
function evaluateMeaningfulSequence(criterion){
    let isVerified = true;
    let isVerifiedHeadings = true;
    const mainElements = document.querySelectorAll('header, nav, main, footer, section, article, h1, h2, h3, h4, h5, h6')
    let previousElementType = "";

    mainElements.forEach(element => {
        const  elementType= element.tagName.toLowerCase();
        if(criterion == "1.3.2"){
            if (!isOrderMeaningful(previousElementType, elementType)) {
                console.log("DEBUG Criteria 1.3.2 \n\tIl primo tag trovato è: " + previousElementType + "\n\tIl secondo tag trovato è: " + elementType + "\n\tL'ordine deve essere il seguente: header, nav, main, section, article, footer.")
                isVerified = false;
            }
        }

        // Gestisco le intestazioni separatamente
        // Questa condizione verifica esplicitamente se il tipo di elemento è uno tra h1, h2, h3, h4, h5, h6.
        // il metodo .includes controlla se elementType è incluso in questo array.
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(elementType)) {
            if (!isHeadingOrderMeaningful(element)) {
                if(criterion == "1.3.2"){
                    console.log("DEBUG Criteria 1.3.2 \n\tL'ordine dei titoli non è rispettato \n\tL'ordine deve essere il seguente: h1, h2, h3, h4, h5, h6")
                }
                isVerified = false;
                isVerifiedHeadings = false;
            }
        }
        previousElementType = elementType;
    });

    if(criterion == "1.3.2"){
        return isVerified
    }else if(criterion == "2.4.10"){
        if(!isVerifiedHeadings){
            console.log("DEBUG Criteria 2.4.10 \n\tL'ordine dei titoli non è rispettato \n\tL'ordine deve essere il seguente: h1, h2, h3, h4, h5, h6")
            return false
        }else{
            return isVerifiedHeadings
        }
    }
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


// 1.3.6 //
// Funzione per verificare il criterio di successo 1.3.6 Identify Purpose
function evaluateIdentifyPurpose() {
    let isVerified = true;

    // Verifico le regioni della pagina
    const regions = document.querySelectorAll('header, nav, main, footer, section, article');
    const regionCount = {};
    // La variabile loggedRegions è un insieme (Set) utilizzato per tenere traccia dei tipi di regioni che sono già stati loggati (registrati) nella console per evitare duplicati.
    const loggedRegions = new Set();

    // Conto quante volte si presenta ciascun tag nella pagina
    regions.forEach(region => {
        const tagName = region.tagName.toLowerCase();
        if (!regionCount[tagName]) {
            regionCount[tagName] = 0;
        }
        regionCount[tagName]++;
    });

    // Verifichiamo che ciascuna regione se non è unica ha l'attributo ARIA, oppure l'attributo role
    regions.forEach(region => {
        const tagName = region.tagName.toLowerCase();
        if (regionCount[tagName] > 1 && !loggedRegions.has(tagName)) {
            if (!region.hasAttribute('role') && !region.hasAttribute('aria-labelledby') && !region.hasAttribute('aria-describedby') && !region.hasAttribute('aria-label')) {
                console.log(`DEBUG Criteria 1.3.6 \n\tIl tag ${region.tagName.toLowerCase()} è presente più di una volta e non ha attributi ARIA role oppure ARIA labels.`);
                isVerified = false;
                loggedRegions.add(tagName);
            }
        }
    });

    // Verifichiamo che gli elementi interattivi abbiano gli attributi ARIA label o ARIA role
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], [role="link"]');
    const interactiveElementsCount = {};
    const loggedInteractiveElements = new Set();
    // Conto quante volte si presenta ciascun tag nella pagina
    interactiveElements.forEach(element => {
        const tagName = element.tagName.toLowerCase();
        if (!interactiveElementsCount[tagName]) {
            interactiveElementsCount[tagName] = 0;
        }
        interactiveElementsCount[tagName]++;
    });

    // Verifico se gli elementi interattivi che non sono unici abbiano gli attributi ARIA
    interactiveElements.forEach(element => {
        const tagName = element.tagName.toLowerCase();
        if (interactiveElementsCount[tagName] > 1 && !loggedInteractiveElements.has(tagName)) {
            if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby') && !element.hasAttribute('aria-describedby') && !element.hasAttribute('role')) {
                console.log(`DEBUG Criteria 1.3.6 \n\tCi sono elementi interattivi <${element.tagName.toLowerCase()}> che non hanno attributi ARIA role oppure ARIA labels.`);
                isVerified = false;
                loggedInteractiveElements.add(tagName);
            }
        }
    });

    // Verifica delle icone e delle immagini
    const icons = document.querySelectorAll('svg, img');
    const iconCount = {};
    const loggedIcons = new Set();

    // Conto quante volte si presenta ciascun tag nella pagina
    icons.forEach(icon => {
        const tagName = icon.tagName.toLowerCase();
        if (!iconCount[tagName]) {
            iconCount[tagName] = 0;
        }
        iconCount[tagName]++;
    });

    // Verifica se le icone e le immagini che non sono uniche abbiano gli attributi ARIA
    icons.forEach(icon => {
        const tagName = icon.tagName.toLowerCase();
        if (iconCount[tagName] > 1 && !loggedIcons.has(tagName)) {
            if (!icon.hasAttribute('aria-label') && !icon.hasAttribute('aria-labelledby') && !icon.hasAttribute('aria-describedby') && !icon.hasAttribute('role')) {
                console.log(`DEBUG Criteria 1.3.6 \n\tCi sono icone <${icon.tagName.toLowerCase()}> che non hanno attributi ARIA role oppure ARIA labels.`);
                isVerified = false;
                loggedIcons.add(tagName);
            }
        }
    });

    return isVerified;
}

// 1.4.2 //
// Funzione per verificare il criterio di successo 1.4.2 Audio Control
function evaluateAudioControl() {
    let isVerified = true;

    // Select all audio and video elements
    const mediaElements = document.querySelectorAll('audio, video');
    // console.log(mediaElements)
    // Check for autoplay and controls attributes
    mediaElements.forEach(element => {
        if (element.hasAttribute('autoplay')) {
            const hasControls = element.hasAttribute('controls');
            const hasPauseStop = element.querySelector('button[aria-label="pause"], button[aria-label="stop"]');
            const hasVolumeControl = element.querySelector('input[type="range"][aria-label="volume"]');

            if (!hasControls && (!hasPauseStop || !hasVolumeControl)) {
                console.log(`DEBUG Criteria 1.3.6 \n\tL'elemento multimediale <${element.tagName.toLowerCase()}> non ha controlli per l'audio o per il video.`);
                isVerified = false;
            }
        }
    });

    return isVerified;
}

// 1.4.3 & 1.4.6 //
// Funzione per verificare il criterio di successo 1.4.3 Contrast (Minimum) e 1.4.6 Contrast(Enhanced)
function getLuminance(color) {
    const rgb = color.match(/\d+/g).map(Number);
    const [r, g, b] = rgb.map(value => {
        value /= 255;
        return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(foreground, background) {
    const lum1 = getLuminance(foreground);
    const lum2 = getLuminance(background);
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

function evaluateContrast(isEnhanced=false) {
    const bodyStyle = window.getComputedStyle(document.body);
    let backgroundColor = bodyStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' ? bodyStyle.backgroundColor : 'rgb(255, 255, 255)';

    // Trovo tutti gli elementi con la proprietà css 'color' all'interno del body
    const colorElements = Array.from(document.querySelectorAll('body *')).filter(element => {
        const style = window.getComputedStyle(element);
        return style.color && style.color !== 'rgba(0, 0, 0, 0)';
    });

    // Trovo il colore maggiormente presente
    const colorFrequency = {};
    colorElements.forEach(element => {
        const color = window.getComputedStyle(element).color;
        if (!colorFrequency[color]) {
            colorFrequency[color] = 0;
        }
        colorFrequency[color]++;
    });

    const sortedColors = Object.keys(colorFrequency).sort((a, b) => colorFrequency[b] - colorFrequency[a]);
    const mostFrequentColor = sortedColors[0];
    // const secondMostFrequentColor = sortedColors[1];

    // Calcolo il contrasto tra il background color e i colori maggiormente presenti
    const contrastRatio1 = getContrastRatio(mostFrequentColor, backgroundColor);
    // const contrastRatio2 = secondMostFrequentColor ? getContrastRatio(secondMostFrequentColor, backgroundColor) : null;

    // Determino se il contrasto è sufficiente 
    const fontSize = parseFloat(window.getComputedStyle(document.body).fontSize);
    const fontWeight = window.getComputedStyle(document.body).fontWeight;
    const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight === 'bold');

    // Soglie di contrasto basate sull'opzione isEnhanced
    const minContrast = isLargeText ? (isEnhanced ? 4.5 : 3) : (isEnhanced ? 7 : 4.5);

    const isVerified1 = contrastRatio1 >= minContrast;
    // const isVerified2 = contrastRatio2 !== null ? contrastRatio2 >= minContrast : true;

    // console.log(`Most frequent text-color: ${mostFrequentColor}, Background color: ${backgroundColor}, Contrast ratio: ${contrastRatio1}`);
    // console.log(`Second most frequent text-color: ${secondMostFrequentColor}, Background color: ${backgroundColor}, Contrast ratio: ${contrastRatio2}`);
    if(!isEnhanced){
        if(isVerified1){
            // console.log(`Most frequent text-color: ${mostFrequentColor}, Background color: ${backgroundColor}, Contrast ratio: ${contrastRatio1}`);
            return true
        }else{
            console.log(`DEBUG Criteria 1.4.3 \n\tIl colore maggiormente utilizzato per i testi (${mostFrequentColor}) e il secondo maggiormente utilizzato (${secondMostFrequentColor}) non contrastano adeguatamente con il colore del background (${backgroundColor}). Ci possono comunque essere delle eccezioni.`)
            return false
        }
    }else{
        if(isVerified1){
            // console.log(`Most frequent text-color: ${mostFrequentColor}, Background color: ${backgroundColor}, Contrast ratio: ${contrastRatio1}`);
            return true
        }else{
            console.log(`DEBUG Criteria 1.4.6 \n\tIl colore maggiormente utilizzato per i testi (${mostFrequentColor}) e il secondo maggiormente utilizzato (${secondMostFrequentColor}) non contrastano adeguatamente con il colore del background (${backgroundColor}). Ci possono comunque essere delle eccezioni.`)
            return false
        }
    }
}

// 1.4.10 //
// Funzione per verificare il criterio di successo 1.4.10 Reflow
function checkReflow() {
    const bodyStyle = window.getComputedStyle(document.body);
    let isVerified = false;

    // Verifica se Flexbox è utilizzato
    if (bodyStyle.display.includes('flex')) {
        // console.log('La pagina utilizza Flexbox.');
        isVerified = true;
    }

    // Verifica se CSS Grid è utilizzato
    if (bodyStyle.display.includes('grid')) {
        // console.log('La pagina utilizza CSS Grid.');
        isVerified = true;
    }

    // In alternativa, cerca Flexbox o Grid all'interno di qualsiasi elemento nella pagina
    if (!isVerified) {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            if (style.display.includes('flex') || style.display.includes('grid')) {
                // console.log(`L'elemento ${element.tagName.toLowerCase()} utilizza ${style.display.includes('flex') ? 'Flexbox' : 'CSS Grid'}.`);
                isVerified = true;
            }
        });
    }

    if(!isVerified){
        console.log(`DEBUG Criteria 1.4.10 \n\tLa pagina non utilizza né Flexbox nè Grid per adattare il layout alle varie viewport`)
        return false
    }else{
        // console.log('La pagina utilizza Flexbox o Grid per adattare il layout alle varie viewport')
        return true
    }
}

// 1.4.11
// Funzione per verificare il criterio di successo 1.4.11 Non-text Contrast
function evaluateNonTextContrast() {
    const elements = document.querySelectorAll('button, input, select, .icon, .graphic, .ui-component');
    let isVerified = true;

    elements.forEach(element => {
        const style = window.getComputedStyle(element);
        // Ignoro input e button privi di contenuto o con display: none
            if ((element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'button') && 
            (style.display === 'none' || (element.value.trim() === '' && element.textContent.trim() === ''))) {
            return; // Salta al prossimo elemento
        }
    
        // Gestisco i casi in cui il background è trasparente o non definito
        let backgroundColor;
        if (style.background === 'transparent' || style.background === '0 0' || style.backgroundColor === 'rgba(0, 0, 0, 0)') {
            return; // Salta al prossimo elemento
        } else {
            backgroundColor = style.backgroundColor;
        }
        const borderColor = style.borderColor !== 'rgba(0, 0, 0, 0)' ? style.borderColor : null;
        const elementColor = style.color !== 'rgba(0, 0, 0, 0)' ? style.color : null;

        let contrastRatio = null;

        // Verifica il contrasto tra il colore di sfondo e il colore dell'elemento
        if (elementColor) {
            contrastRatio = getContrastRatio(elementColor, backgroundColor);
        } else if (borderColor) {
            contrastRatio = getContrastRatio(borderColor, backgroundColor);
        }

        if (contrastRatio && contrastRatio < 3) {
            console.log(`DEBUG Criteria 1.4.11 \n\tL'elemento ${element.tagName.toLowerCase()} riportato sotto non rispetta il contrasto minimo: ${contrastRatio.toFixed(2)}:1.`);
            console.log(element, backgroundColor, elementColor, borderColor, contrastRatio)
            isVerified = false;
        }
    });

    return isVerified;
}

// 1.4.12
// Funzione per verificare il criterio di successo 1.4.12 "Text Spacing"
// The getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
// The getBoundingClientRect() method returns a DOMRect object with eight properties: left, top, right, bottom, x, y, width, height

function evaluateTextSpacing() {
    const textElements = document.querySelectorAll('body, body *:not(noscript):not(script):not(style):not(link):not(svg):not(g):not(path):not(img):not(figure)');
    let isVerified = true;
    const debugMessages = [];

    // Applico gli stili di spaziatura per la verifica
    textElements.forEach(element => {
        const originalLineHeight = element.style.lineHeight;
        const originalLetterSpacing = element.style.letterSpacing;
        const originalWordSpacing = element.style.wordSpacing;
        const originalMarginBottom = element.style.marginBottom;

        element.style.lineHeight = '1.5';
        element.style.letterSpacing = '0.12em';
        element.style.wordSpacing = '0.16em';
        element.style.marginBottom = '2em';
        

        const parent = element.parentElement;
        const elementRect = element.getBoundingClientRect();
        const parentRect = parent ? parent.getBoundingClientRect() : null;

        // Controllo se il testo viene tagliato rispetto ai bordi del contenitore padre
        if (parentRect && (Math.floor(elementRect.right) > Math.floor(parentRect.right) || Math.floor(elementRect.bottom) > Math.floor(parentRect.bottom))) {
            debugMessages.push(`\tIl testo nell'elemento con tag <${element.tagName.toLowerCase()}> viene tagliato e non è completamente visibile se l'utente modifica le spaziature come indicazioni del criterio 1.4.12.`);
            // per mostrare in console qual è l'elemto specifico
            // console.log(element)
            isVerified = false;
        }

        // Ripristino gli stili originali
        element.style.lineHeight = originalLineHeight;
        element.style.letterSpacing = originalLetterSpacing;
        element.style.wordSpacing = originalWordSpacing;
        element.style.marginBottom = originalMarginBottom;
    });

    // Stampo tutti i messaggi di debug in un'unica sezione
    if (debugMessages.length > 0) {
        console.log("DEBUG Criteria 1.4.12\n", debugMessages.join("\n"));
    }

    return isVerified;
}

// 2.4.2
// Funzione per verificare il criterio di successo 2.4.2 "Page Titled"
function evaluatePageTitle() {
    let isVerified = true;
    const debugMessages = [];

    // Verifico la presenza dell'elemento <title>
    const titleElement = document.querySelector('head > title');
    if (!titleElement) {
        debugMessages.push("\tIl tag <title> non è presente nell'elemento <head> della pagina.");
        isVerified = false;
    } else {
        const titleText = titleElement.textContent.trim();

        // Verifico che il titolo non sia vuoto
        if (titleText === "") {
            debugMessages.push("\tIl tag <title> è presente ma non contiene alcun testo.");
            isVerified = false;
        }

        // Verifico che il titolo sia descrittivo
        if (titleText.length < 10) { // Questo controllo può essere adattato in base ai criteri specifici di descrittività
            debugMessages.push("\tIl titolo della pagina potrebbe non essere sufficientemente descrittivo.");
            isVerified = false;
        }
    }

    // Stampo tutti i messaggi di debug in un'unica sezione
    if (debugMessages.length > 0) {
        console.log("DEBUG Criteria 2.4.2 Page Titled\n", debugMessages.join("\n"));
    } else {
        // console.log("DEBUG Criteria 2.4.2 Page Titled\nIl titolo della pagina è presente, non è vuoto e sembra descrittivo.");
    }

    return isVerified;
}

// 3.1.1
// Funzione per verificare il criterio di successo 3.1.1 "Language of Page"
// Facciamo sì che la funzione evaluateLanguageOfPage restituisca una Promise che può essere attesa (await) prima di continuare con la generazione del report. A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value
function evaluateLanguageOfPage() {
    return new Promise((resolve) => {
        const debugMessages = [];

        // Verifico la presenza dell'elemento <title>
        const titleElement = document.querySelector('head > title');
        const titleText = titleElement ? titleElement.textContent.trim() : '';

        // Verifico la presenza dell'attributo lang nell'elemento <html>
        const htmlElement = document.documentElement;
        // console.log(htmlElement)
        const lang = htmlElement.getAttribute('lang');

        if (!lang) {
            debugMessages.push("\tL'attributo 'lang' non è presente nell'elemento <html>.");
            resolve(finalizeEvaluation(false, debugMessages));
        } else {
            detectLanguage(titleText).then(langDetect => {
                if (langDetect === lang) {
                    resolve(finalizeEvaluation(true, debugMessages));
                } else {
                    debugMessages.push(`\tLa lingua identificata è ${langDetect} e non corrisponde con la lingua del documento HTML che è ${lang}`);
                    resolve(finalizeEvaluation(false, debugMessages));
                }
            }).catch(err => {
                console.error("Errore durante la verifica della lingua:", err);
                resolve(finalizeEvaluation(false, debugMessages));
            });
        }
    });
}

function finalizeEvaluation(isVerified, debugMessages) {
    if (debugMessages.length > 0) {
        console.log("DEBUG Criteria 3.1.1 Language of Page\n", debugMessages.join("\n"));
    }
    return isVerified ? "verified" : "not verified";
}

function detectLanguage(text) {
    const apiKey = '3263a01b42208f32cd9e0c697f5cc6cc';
    const url = `https://ws.detectlanguage.com/0.2/detect?q=${encodeURIComponent(text)}&key=${apiKey}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.data && data.data.detections.length > 0) {
                return data.data.detections[0].language;
            } else {
                throw new Error('Unable to detect language');
            }
        });
}

// 3.3.2
// Funzione per valutare il criterio di successo 3.3.2 Label or Instructions
function evaluateLabelOrInstructions(){
    let isVerified = true;
    const debugMessages = [];
    // Seleziono tutti gli input, textarea e select, escludendo gli input di tipo hidden
    const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');

    // Itero su ciascun elemento di input
    inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledby = input.getAttribute('aria-labelledby');

        let passed = false;

        // Verifico se esiste una label associata all'input e se contiene almeno 5 caratteri
        if (label && label.textContent.trim().length >= 5) {
            passed = true;
        }

        // Verifica se l'attributo aria-label esiste e contiene almeno 5 caratteri
        if (ariaLabel && ariaLabel.trim().length >= 5) {
            passed = true;
        }

        // Verifica se l'attributo aria-labelledby esiste e fa riferimento a un elemento esistente con almeno 5 caratteri
        if (ariaLabelledby) {
            const referencedElement = document.getElementById(ariaLabelledby);
            if (referencedElement && referencedElement.textContent.trim().length >= 5) {
                passed = true;
            }
        }

        // Se nessuna delle verifiche è passata, imposta isVerified su false e aggiungi un messaggio di debug
        if (!passed) {
            debugMessages.push(`\tL'elemento ${input.tagName.toLowerCase()} non ha una label valida o un attributo aria-label/aria-labelledby che sia sufficientemente descrittivo.`);
            isVerified = false;
        }
    });

    // Stampa tutti i messaggi di debug in un'unica sezione
    if (debugMessages.length > 0) {
        console.log("DEBUG Criteria 3.3.2\n", debugMessages.join("\n"));
    }

    return isVerified;
}

// Funzione per generare il JSON finale
async function generateAccessibilityReport() {
    const report = {
        "guidelines": {
            "Perceivable": {
                "1.1 Text Alternatives": {
                    "1.1.1 Non-text Content": evaluateNonTextContent() ? "verified" : "not verified"
                },
                "1.3 Adaptable": {
                    "1.3.1 Info and Relationships": evaluateInfoAndRelationships() ? "verified" : "not verified",
                    "1.3.2 Meaningful Sequence": evaluateMeaningfulSequence("1.3.2") ? "verified" : "not verified",
                    "1.3.4 Orientation": evaluateOrientation() ? "verified" : "not verified",
                    "1.3.5 Identify Input Purpose": evaluateIdentifyInputPurpose() ? "verified" : "not verified",
                    "1.3.6 Identify Purpose": evaluateIdentifyPurpose() ? "verified" : "not verified"
                },
                "1.4 Distinguishable": {
                    "1.4.2 Audio Control": evaluateAudioControl() ? "verified" : "not verified",
                    "1.4.3 Contrast (Minimum)":  evaluateContrast() ? "verified" : "not verified",
                    "1.4.6 Contrast (Enhanced)": evaluateContrast(isEnhanced=true) ? "verified" : "not verified",
                    "1.4.10 Reflow": checkReflow() ? "verified" : "not verified",
                    "1.4.11 Non-text Contrast": evaluateNonTextContrast() ? "verified" : "not verified",
                    "1.4.12 Text Spacing": evaluateTextSpacing() ? "verified" : "not verified",
                    "1.4.13 Content on Hover or Focus": ""
                }
            },
            "Operable": {
                "2.4 Navigable": {
                    "2.4.2 Page Titled": evaluatePageTitle() ? "verified" : "not verified",
                    "2.4.10 Section Headings": evaluateMeaningfulSequence("2.4.10") ? "verified" : "not verified",
                }
            },
            "Understandable": {
                "3.1 Readable": {
                    "3.1.1 Language of Page": await evaluateLanguageOfPage(),
                    "3.1.2 Language of Parts": ""
                },
                "3.3 Input Assistance": {
                    "3.3.2 Labels or Instructions": evaluateLabelOrInstructions() ? "verified" : "not verified",
                    "3.3.8 Accessible Authentication (Minimum)": ""
                }
            },
            "Robust": {
                "4.1 Compatible": {
                    "4.1.2 Name, Role, Value": ""
                }
            }
        }
    };
    return report;
}


// Listener per i messaggi ricevuti dal popup (qui viene gestita la comunicazione tra popup.js e content_script.js)
browser.runtime.onMessage.addListener(async function(message) {
    if (message.command === "analyze") {
        const accessibilityReport = await generateAccessibilityReport();
        // Verifica l'impatto della modifica della spaziatura del testo
        // console.log("Text Spacing Impact Verification:", evaluateTextSpacing()); 
        evaluateLabelOrInstructions()
        // evaluateContrast();
        // evaluateIdentifyPurpose();
        // evaluateOrientation();
        // console.log(accessibilityReport);
        // console.log(evaluateInfoAndRelationships());
        // Invia il rapporto al popup per la visualizzazione
        browser.runtime.sendMessage({ report: accessibilityReport });
        // console.log("Report inviato:", accessibilityReport);
    }
});