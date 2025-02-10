/**
 * Trouve le prochain vendredi à partir d'une date donnée
 * Si la date donnée est un vendredi et qu'il est avant minuit, retourne cette même date
 * Sinon, retourne la date du prochain vendredi
 * 
 * @param {Date} date - La date de référence
 * @returns {Date} La date du prochain vendredi
 * @example
 * const nextFriday = prochainVendredi(new Date());
 */
function prochainVendredi(date) {
    const result = new Date(date);
    const jour = result.getDay();

    // Cette ligne utilise un opérateur ternaire pour calculer le nombre de jours jusqu'au prochain vendredi :
    // jour <= 5 vérifie si on est avant ou pendant vendredi
    // Si vrai : 5 - jour calcule directement les jours jusqu'à vendredi
    // Si faux : 5 - jour + 7 ajoute une semaine pour atteindre le prochain vendredi
    const diff = jour === 5 ? 0 : (5 - jour + 7) % 7;
    result.setDate(result.getDate() + diff);
    return result;
}

/**
 * Vérifie si une date donnée correspond au vendredi de la semaine en cours
 * 
 * @param {Date} date - La date à vérifier
 * @returns {boolean} true si la date correspond au vendredi de la semaine en cours, false sinon
 * @example
 * if (estVendrediActuel(new Date())) {
 *     console.log("C'est le vendredi de cette semaine");
 * }
 */
function estVendrediActuel(date) {
    const aujourdHui = aujourdhui();
    const vendrediCetteSemaine = prochainVendredi(aujourdHui);
    
    // On compare uniquement les dates, pas le fait qu'on soit vendredi ou non
    return date.getDate() === vendrediCetteSemaine.getDate() &&
           date.getMonth() === vendrediCetteSemaine.getMonth() &&
           date.getFullYear() === vendrediCetteSemaine.getFullYear();
}

/**
 * Calcule le nombre de semaines écoulées entre la date de départ et aujourd'hui
 * 
 * @param {Date} dateDepart - La date de départ pour le calcul
 * @param {Date} aujourdHui - La date actuelle
 * @returns {number} Le nombre de semaines écoulées (minimum 0)
 * @example
 * const semaines = calculerSemainesEcoulees(new Date('2024-01-01'), new Date());
 */
function calculerSemainesEcoulees(dateDepart, aujourdHui) {
    const vendrediActuel = prochainVendredi(aujourdHui);
    
    //Calcule la différence en millisecondes entre le vendredi actuel et la date de départ
    const timeDiff = vendrediActuel.getTime() - dateDepart.getTime();

    // Convertit la différence en semaines
        // 1000 : millisecondes en secondes 
        // * 60 : secondes en minutes
        // * 60 : minutes en heures
        // * 24 : heures en jours
        // * 7 : jours en semaines
        // Math.floor() arrondit à l'entier inférieur
        // Math.max(0, ...) garantit que le résultat n'est jamais négatif
    return Math.max(0, Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000)));
}

/**
 * Obtient la liste des responsables actuels et futurs
 * 
 * @param {Array<Object>} participants - Liste des participants
 * @param {string} participants[].nom - Nom du participant
 * @param {Array<string>} participants[].allergenes - Liste des allergènes du participant
 * @param {Date} dateDepart - Date de départ pour le calcul de la rotation
 * @returns {Array<Object>} Liste des responsables avec leurs informations
 * @returns {Date} return[].date - Date de passage
 * @returns {Object} return[].personne - Informations sur la personne
 * @returns {number} return[].joursRestants - Nombre de jours avant le passage
 * @returns {boolean} return[].estAujourdhui - Indique si c'est le responsable du jour
 * @example
 * const responsables = getResponsables([
 *     { nom: "John", allergenes: [] },
 *     { nom: "Jane", allergenes: ["gluten"] }
 * ], new Date('2024-01-01'));
 */
function getResponsables(participants, dateDepart) {
    const aujourdHui = aujourdhui();
    const semainesEcoulees = calculerSemainesEcoulees(dateDepart, aujourdHui);
    const indexResponsable = semainesEcoulees % participants.length;
    
    const vendrediActuel = prochainVendredi(aujourdHui);
    const responsablesData = [];
    let prochaineDate = new Date(vendrediActuel);

    for (let i = 0; i < participants.length; i++) {
        const currentIndex = (indexResponsable + i) % participants.length;
        const personne = participants[currentIndex];
        const diffJours = Math.ceil((prochaineDate - aujourdHui) / (1000 * 60 * 60 * 24));

        // On utilise estVendrediActuel pour identifier le responsable de la semaine
        const estCetteSemaine = estVendrediActuel(prochaineDate);
        
        // Mais on ajoute une vérification plus stricte pour l'affichage "Aujourd'hui"
        const estAujourdhui = estCetteSemaine && aujourdHui.getDay() === 5;

        responsablesData.push({
            date: new Date(prochaineDate),
            personne: personne,
            joursRestants: diffJours,
            estAujourdhui: estAujourdhui,
            estCetteSemaine: estCetteSemaine
        });

        prochaineDate.setDate(prochaineDate.getDate() + 7);
    }

    return responsablesData;
}

/**
 * Obtient la date du jour
 * 
 * @returns {Date} La date du jour
 * @example
 * const aujourdHui = aujourdhui();
 */
function aujourdhui() {
    const aujourdHui = new Date();
    return aujourdHui;
}