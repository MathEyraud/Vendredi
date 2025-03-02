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
        const currentDate = new Date();
        
        // Calcul des semaines écoulées depuis la date de départ
        const weeksPassed = DateUtils.getWeeksBetween(startDate, currentDate);
        
        // Calcul de l'index actuel en tenant compte de la rotation
        return weeksPassed % members.length;
    }
    
    /**
     * Met à jour l'index du responsable actuel
     * @returns {boolean} true si la mise à jour a réussi
     */
    updateCurrentIndex() {
        const newIndex = this.calculateCurrentIndex();
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
        
        return {
            date: currentFriday,
            member: currentMember,
            daysRemaining: daysRemaining,
            isToday: DateUtils.isToday(currentFriday)
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
     * Génère l'historique des tours précédents
     * @param {number} [count=5] - Nombre d'entrées à générer
     * @returns {Array<RotationInfo>} Liste des tours précédents
     */
    getPastRotations(count = APP_CONFIG.NOMBRE_HISTORIQUE) {
        const members = this._teamModel.getCurrentMembers();
        const currentIndex = this._teamModel.getCurrentIndex();
        const startDate = this._teamModel.getStartDate();
        const result = [];
        
        // Date de référence (vendredi de la semaine actuelle)
        const currentFriday = DateUtils.getCurrentFriday();
        
        // Génère les tours précédents
        for (let i = 1; i <= count; i++) {
            // Calcule la date du tour précédent
            const pastDate = DateUtils.getFridayDate(currentFriday, -i);
            
            // Vérifie si la date est postérieure à la date de démarrage
            if (pastDate >= startDate) {
                // Calcule l'index du responsable précédent
                const pastIndex = (currentIndex - i + members.length) % members.length;
                const pastMember = members[pastIndex];
                
                result.push({
                    date: pastDate,
                    member: pastMember,
                    daysRemaining: 0, // Déjà passé
                    isToday: false
                });
            } else {
                // Si la date est antérieure à la date de démarrage, on arrête
                break;
            }
        }
        
        return result;
    }
}