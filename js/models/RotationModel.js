/**
 * @fileoverview Modèle de gestion de la rotation des responsables
 * Gère la logique de calcul des tours
 */

/**
 * @typedef {Object} RotationInfo
 * @property {Date} date - Date du tour
 * @property {Object} member - Membre responsable
 * @property {number} daysRemaining - Jours restants
 * @property {boolean} isToday - Indique si c'est aujourd'hui
 */

/**
 * @class RotationModel
 * Gère la logique de rotation des responsables
 */
class RotationModel {
    /**
     * Crée une instance du modèle de rotation
     * @param {TeamModel} teamModel - Modèle d'équipe
     */
    constructor(teamModel) {
        /**
         * Référence au modèle d'équipe
         * @type {TeamModel}
         * @private
         */
        this._teamModel = teamModel;
    }
    
    /**
     * Calcule l'index du responsable actuel
     * @returns {number} Index du responsable actuel
     */
    calculateCurrentIndex() {
        const startDate = this._teamModel.getStartDate();
        const members = this._teamModel.getCurrentMembers();
        const currentDate = DateService.getCurrentDate();
        
        // Obtenir le vendredi actuel (celui de la semaine en cours)
        const currentFriday = DateUtils.getCurrentFriday();
        
        // Le vendredi actuel appartient à la semaine en cours si nous sommes vendredi ou avant,
        // sinon il appartient à la semaine suivante
        const isBeforeOrOnFriday = currentDate.getDay() <= APP_CONFIG.JOUR_CROISSANTS;
        
        // Si nous sommes vendredi ou avant, utiliser le vendredi actuel
        // Si nous sommes après vendredi, utiliser le vendredi précédent
        const referenceDate = isBeforeOrOnFriday 
            ? currentFriday 
            : new Date(currentFriday.getTime() - 7 * 24 * 60 * 60 * 1000); // Vendredi de la semaine précédente
        
        // Calculer le nombre de semaines écoulées depuis la date de départ jusqu'à la date de référence
        const weeksPassed = Math.floor(DateUtils.getDaysBetween(startDate, referenceDate) / 7);
        
        console.log(`Calcul de l'index: date actuelle=${currentDate.toDateString()}, vendredi actuel=${currentFriday.toDateString()}, date de référence=${referenceDate.toDateString()}, semaines écoulées=${weeksPassed}`);
        
        // Calculer l'index en fonction du nombre de semaines écoulées
        return weeksPassed % members.length;
    }
    
    /**
     * Met à jour l'index du responsable actuel
     * @returns {boolean} true si la mise à jour a réussi
     */
    updateCurrentIndex() {
        const newIndex = this.calculateCurrentIndex();
        console.log(`Mise à jour de l'index: nouvel index calculé = ${newIndex}`);
        return this._teamModel.setCurrentIndex(newIndex);
    }
    
    /**
     * Récupère les informations sur le responsable actuel
     * @returns {RotationInfo} Informations sur le responsable actuel
     */
    getCurrentRotation() {
        // Met à jour l'index actuel pour s'assurer qu'il est correct
        this.updateCurrentIndex();
        
        // Récupère le membre actuel
        const currentMember = this._teamModel.getCurrentMember();
        
        // Calcule la date du vendredi actuel
        const currentFriday = DateUtils.getCurrentFriday();
        
        // Calcule les jours restants
        const daysRemaining = DateUtils.getDaysUntil(currentFriday);
        
        // Vérification si c'est aujourd'hui
        const isToday = DateUtils.isToday(currentFriday);
        
        console.log(`Rotation actuelle: ${currentMember?.name} pour le ${currentFriday.toDateString()}, jours restants: ${daysRemaining}, est aujourd'hui: ${isToday}`);
        
        return {
            date: currentFriday,
            member: currentMember,
            daysRemaining: daysRemaining,
            isToday: isToday
        };
    }
    
    /**
     * Génère la liste des prochains responsables
     * @returns {Array<RotationInfo>} Liste des prochains responsables
     */
    getNextRotations() {
        // Met à jour l'index actuel
        this.updateCurrentIndex();
        
        const members = this._teamModel.getCurrentMembers();
        const currentIndex = this._teamModel.getCurrentIndex();
        const result = [];
        
        // Date de référence (vendredi de la semaine actuelle)
        const currentFriday = DateUtils.getCurrentFriday();
        
        // Nombre de rotations à afficher = nombre de membres - 1 (car le membre actuel est déjà affiché séparément)
        const count = members.length - 1;
        
        console.log(`Génération des ${count} prochaines rotations à partir de l'index ${currentIndex}`);
        
        // Génère les prochains tours pour chaque membre restant de l'équipe
        for (let i = 1; i <= count; i++) {
            // Calcule l'index du prochain responsable
            const nextIndex = (currentIndex + i) % members.length;
            const nextMember = members[nextIndex];
            
            // Calcule la date du prochain tour
            const nextDate = DateUtils.getFridayDate(currentFriday, i);
            
            // Calcule les jours restants
            const daysRemaining = DateUtils.getDaysUntil(nextDate);
            
            result.push({
                date: nextDate,
                member: nextMember,
                daysRemaining: daysRemaining,
                isToday: false // Par définition, les prochains tours ne sont jamais aujourd'hui
            });
        }
        
        return result;
    }
    
    /**
     * Génère l'historique des tours précédents depuis la date de démarrage
     * @returns {Array<RotationInfo>} Liste complète des tours précédents
     */
    getPastRotations() {
        // S'assurer que l'index courant est à jour
        this.updateCurrentIndex();
        
        const members = this._teamModel.getCurrentMembers();
        const currentIndex = this._teamModel.getCurrentIndex();
        const startDate = new Date(this._teamModel.getStartDate()); // Créer une nouvelle référence de date
        const result = [];
        
        // Date de référence (vendredi de la semaine actuelle)
        const currentFriday = DateUtils.getCurrentFriday();
        
        console.log(`Génération de l'historique complet depuis ${startDate.toDateString()}`);
        
        // Approche alternative : génération des vendredis depuis la date de départ
        // Trouver le premier vendredi à partir de la date de démarrage
        let firstFriday = new Date(startDate);
        // Si la date de démarrage n'est pas un vendredi, trouver le premier vendredi suivant
        if (firstFriday.getDay() !== APP_CONFIG.JOUR_CROISSANTS) {
            const daysToAdd = (APP_CONFIG.JOUR_CROISSANTS - firstFriday.getDay() + 7) % 7;
            firstFriday.setDate(firstFriday.getDate() + daysToAdd);
        }
        
        // Liste de tous les vendredis depuis le premier vendredi jusqu'au vendredi actuel
        const allFridays = [];
        let tempFriday = new Date(firstFriday);
        
        while (tempFriday <= currentFriday) {
            allFridays.push(new Date(tempFriday)); // Ajouter une copie de la date
            tempFriday.setDate(tempFriday.getDate() + 7); // Avancer d'une semaine
        }
        
        // On enlève le vendredi courant car il n'est pas dans l'historique
        if (allFridays.length > 0 && 
            DateUtils.isDateSame(allFridays[allFridays.length - 1], currentFriday)) {
            allFridays.pop();
        }
        
        // Parcourir tous les vendredis passés à partir du plus récent
        for (let i = allFridays.length - 1; i >= 0; i--) {
            const pastFriday = allFridays[i];
            
            // Calculer l'index de la personne pour ce vendredi
            // Nombre de semaines depuis le premier vendredi
            const weeksFromStart = Math.floor(DateUtils.getDaysBetween(firstFriday, pastFriday) / 7);
            // Index de départ (initialIndex serait 0 ou la valeur définie au démarrage)
            const initialIndex = 0; // Ou une autre valeur selon votre logique initiale
            const pastIndex = (initialIndex + weeksFromStart) % members.length;
            
            const pastMember = members[pastIndex];
            
            result.push({
                date: pastFriday,
                member: pastMember,
                daysRemaining: 0, // Déjà passé
                isToday: false
            });
        }
        
        // Inverser le résultat pour avoir les dates plus récentes en premier
        return result.sort();
    }
}