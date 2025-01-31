document.querySelectorAll('.crt86').forEach(div => {
    const bg = div.getAttribute('data-background'); // Pobiera nazwę pliku
    if (bg) { 
        div.style.backgroundImage = `url('${bg}')`;
        console.log(`url do tła ('${bg}')`);
    }
});

// Funkcja do wyświetlania szczegółów projektu
function showDetails(projectName, file) {
    // Ukrywamy główną sekcję z projektami
    document.querySelector('.container-main').classList.add('hidden');
    
    // Pokazujemy szczegóły w container-details
    const containerDetails = document.querySelector('.container-details');
    containerDetails.style.display = 'block';

    // Wstawiamy odpowiednią zawartość do container-details
    let content = '';
    if (projectName && file) {
        content = `
            <h2>Details about:</h2>
            <iframe src="./projects/${file}" title="${projectName}" width="100%" height="80%" style="border: none; border-radius: 10px;"></iframe>
            <button class="back-button" onclick="hideDetails()">Go back</button>
        `;
    }

    // Wstawiamy zawartość do container-details
    containerDetails.innerHTML = content;
}

// Funkcja do ukrywania szczegółów i przywracania widoku projektów
function hideDetails() {
    // Ukrywamy sekcję z detalami projektu
    document.querySelector('.container-details').style.display = 'none';

    // Pokazujemy ponownie sekcję z projektami
    document.querySelector('.container-main').classList.remove('hidden');
}

function openProject(url) {
    window.open(url, '_blank');  // Otwiera link w nowej karcie
}