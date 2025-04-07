const RSS_FEEDS = [
    { name: "Google News", url: "https://news.google.com/rss/search?q=intelligence+artificielle&hl=fr&gl=FR&ceid=FR:fr" },
    { name: "Le Monde", url: "https://www.lemonde.fr/pixels/rss_full.xml" },
    { name: "League of Legends", url: "https://www.team-aaa.com/rss/portal_league-of-legends.xml" }, // Flux RSS sur lol
    { name: "hardware",url:"https://www.canardpc.com/cat%C3%A9gorie/hardware/feed"},// flux rss hardware
    { name:"news-jv",url:"https://www.canardpc.com/cat%C3%A9gorie/jeu-video/news-jeu-video/feed"},//flux rss jv genreal
    { name: "PSG Officiel", url: "https://www.psg.fr/rss/actualites" }, // Flux RSS sur le PSG
    { name: "football", url:"https://www.lequipe.fr/Football/"}
];

// Fonction principale qui gère la récupération des flux RSS pour l'IA
async function fetchIARSS() {
    const rssFeedElement = document.getElementById("rss-feed");
    rssFeedElement.innerHTML = "Chargement des articles...";

    for (const feed of RSS_FEEDS.filter(f => f.name === "Google News" || f.name === "Le Monde")) { // Filtrer les flux IA
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`);
            const data = await response.json();

            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "text/xml");

            rssFeedElement.innerHTML += `<h3>${feed.name}</h3>`;
            displayRSS(xml, rssFeedElement);
        } catch (error) {
            console.error(`Erreur lors de la récupération du flux RSS (${feed.name}) :`, error);
            rssFeedElement.innerHTML += `<p>Impossible de charger les articles de ${feed.name}.</p>`;
        }
    }
}

// Fonction pour récupérer les articles concernant les jeux vidéo
async function fetchJVRSS() {
    const rssFeedElement = document.getElementById("rss-feed-jv");
    rssFeedElement.innerHTML = "Chargement des articles...";

    for (const feed of RSS_FEEDS.filter(f => f.name === "League of Legends"|| f.name === "hardware"|| f.name === "news-jv")) { // Filtrer les flux JV
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`);
            const data = await response.json();

            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "text/xml");

            rssFeedElement.innerHTML += `<h3>${feed.name}</h3>`;
            displayRSS(xml, rssFeedElement);
        } catch (error) {
            console.error(`Erreur lors de la récupération du flux RSS (${feed.name}) :`, error);
            rssFeedElement.innerHTML += `<p>Impossible de charger les articles de ${feed.name}.</p>`;
        }
    }
}

// Fonction pour récupérer les articles concernant le PSG
async function fetchPSGRSS() {
    const rssFeedElement = document.getElementById("rss-feed-psg");
    rssFeedElement.innerHTML = "Chargement des articles...";

    for (const feed of RSS_FEEDS.filter(f => f.name === "football")) { // Filtrer les flux PSG
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`);
            const data = await response.json();

            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "text/xml");

            rssFeedElement.innerHTML += `<h3>${feed.name}</h3>`;
            displayRSS(xml, rssFeedElement);
        } catch (error) {
            console.error(`Erreur lors de la récupération du flux RSS (${feed.name}) :`, error);
            rssFeedElement.innerHTML += `<p>Impossible de charger les articles de ${feed.name}.</p>`;
        }
    }
}

// Fonction qui affiche les articles dans le DOM
function displayRSS(xml, rssFeedElement) {
    const items = xml.querySelectorAll("item");
    let html = "";
    const uniqueLinks = new Set(); // Pour éviter les doublons

    items.forEach((item, index) => {
        if (index < 4) {  // Limite à 4 articles par source
            const title = item.querySelector("title")?.textContent || "Sans titre";
            let link = item.querySelector("link")?.textContent || "#";
            const description = item.querySelector("description")?.textContent || "Pas de description";

            // Supprimer les liens en double (notamment pour Google News)
            if (!uniqueLinks.has(link)) {
                uniqueLinks.add(link);
                html += `
                    <div class="article">
                        <a href="${link}" target="_blank">${title}</a>
                        <p>${description}</p>
                    </div>
                `;
            }
        }
    });

    rssFeedElement.innerHTML += html || "<p>Aucun article disponible.</p>";
}

// Appel des fonctions pour chaque catégorie
fetchIARSS();
fetchJVRSS();
fetchPSGRSS();
