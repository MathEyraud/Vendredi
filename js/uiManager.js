/**
 * Affiche les informations de l'équipe sélectionnée dans l'interface utilisateur.
 * Cette fonction gère trois aspects principaux :
 * 1. Affichage du responsable actuel
 * 2. Affichage des allergènes de l'équipe
 * 3. Génération du tableau des prochains passages
 * 
 * @param {Array<Object>} participants - Liste des participants de l'équipe
 * @param {string} participants[].nom - Nom du participant
 * @param {Array<string>} participants[].allergenes - Liste des allergènes du participant
 * @throws {Error} Si les éléments du DOM requis ne sont pas trouvés
 */
function afficherEquipe(participants) {
    
    // Récupère la liste complète des responsables avec leurs dates de passage
    // Inclut les informations : date de passage, personne, jours restants, si c'est aujourd'hui
    const responsables = getResponsables(participants, dateDepart);
    
    // Trouve le responsable de la semaine actuelle dans la liste
    const responsableActuel = responsables.find(r => r.estAujourdhui);

    // SECTION 1 : Mise à jour de l'affichage du responsable actuel
    const nomResponsableElement = document.getElementById("nomResponsable");
    if (!nomResponsableElement) {
        throw new Error("Element 'nomResponsable' non trouvé dans le DOM");
    }
    // Affiche le nom du responsable ou un message par défaut si personne n'est désigné
    nomResponsableElement.textContent = 
        responsableActuel ? responsableActuel.personne.nom : "Personne cette semaine";

    // SECTION 2 : Gestion des allergènes
    // Crée un Set pour stocker les allergènes uniques de toute l'équipe
    const allergenesEquipe = new Set();
    participants.forEach(personne => {
        // Ajoute les allergènes de chaque personne au Set (dédoublonnage automatique)
        personne.allergenes.forEach(allergene => allergenesEquipe.add(allergene));
    });

    // Récupère le conteneur pour l'affichage des allergènes
    const allergeneContainer = document.getElementById("allergenes");
    if (!allergeneContainer) {
        throw new Error("Element 'allergenes' non trouvé dans le DOM");
    }
    
    // Affiche soit la liste des allergènes, soit un message "aucun allergène"
    allergeneContainer.innerHTML = allergenesEquipe.size > 0
        ? `<h3>⚠️ Allergènes dans l'équipe :</h3><p>${[...allergenesEquipe].join(" - ")}</p>`
        : `<h3>✅ Aucun allergène déclaré dans cette équipe</h3>`;

    // SECTION 3 : Génération du tableau des passages
    const tbody = document.getElementById("listeProchainesDates");
    if (!tbody) {
        throw new Error("Element 'listeProchainesDates' non trouvé dans le DOM");
    }
    
    // Réinitialise le contenu du tableau
    tbody.innerHTML = "";

    // Pour chaque responsable, crée une ligne dans le tableau
    responsables.forEach(({date, personne, joursRestants, estAujourdhui}) => {
        // Construction de la ligne avec :
        // - Classe spéciale si c'est le responsable du jour
        // - Date formatée
        // - Nom avec indication si c'est aujourd'hui
        // - Nombre de jours restants avec gestion du pluriel
        tbody.innerHTML += `
            <tr${estAujourdhui ? ' class="today"' : ''}>
                <td>${date.toLocaleDateString()}</td>
                <td>${personne.nom}${estAujourdhui ? ' (Aujourd\'hui)' : ''}</td>
                <td>${joursRestants} jour${joursRestants > 1 ? 's' : ''}</td>
            </tr>
        `;
    });
}