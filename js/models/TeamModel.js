/**
 * @fileoverview Modèle de gestion des équipes
 * Centralise les données et opérations liées aux équipes
 */

/**
 * @class TeamModel
 * Gère les données et opérations liées aux équipes
 */
class TeamModel {
    /**
     * Crée une instance du modèle d'équipe
     * @constructor
     */
    constructor() {
        /**
         * Données des services
         * @type {Object}
         * @private
         */
        this._data = StorageService.getData();
        
        // Vérifier que les données ont été chargées correctement
        if (!this._data || Object.keys(this._data).length === 0) {
            console.error("Aucune donnée d'équipe n'a pu être chargée.");
            // Initialiser avec un objet vide pour éviter les erreurs
            this._data = {};
        } else {
            console.log("Données d'équipes chargées:", Object.keys(this._data));
        }
        
        /**
         * Service actuellement sélectionné
         * @type {string}
         * @private
         */
        this._currentServiceId = StorageService.getSelectedService();
        
        // Vérifier que le service sélectionné existe
        if (!this._data[this._currentServiceId]) {
            console.warn(`Le service sélectionné '${this._currentServiceId}' n'existe pas. Utilisation du premier service disponible.`);
            // Utiliser le premier service disponible comme fallback
            const availableServices = Object.keys(this._data);
            if (availableServices.length > 0) {
                this._currentServiceId = availableServices[0];
            } else {
                console.error("Aucun service disponible.");
                // Initialiser avec une valeur par défaut
                this._currentServiceId = APP_CONFIG.EQUIPE_PAR_DEFAUT;
            }
        }
        
        // Vérification de débogage de la structure des équipes
        this._checkTeamsStructure();
    }
    
    /**
     * Vérifie la structure des équipes pour le débogage
     * @private
     */
    _checkTeamsStructure() {
        console.log("Vérification de la structure des équipes:");
        for (const [teamId, team] of Object.entries(this._data)) {
            console.log(`Équipe ${teamId}:`, team.name);
            if (team.members && Array.isArray(team.members)) {
                const sampleMember = team.members[0];
                console.log(`  Structure d'un membre:`, sampleMember);
                if (sampleMember.allergenes) {
                    console.log(`  Format des allergènes:`, sampleMember.allergenes);
                } else {
                    console.error(`  PROBLÈME: La propriété 'allergenes' est manquante ou incorrecte`);
                }
            }
        }
    }
    
    /**
     * Récupère l'ID du service actuellement sélectionné
     * @returns {string} ID du service actuel
     */
    getCurrentServiceId() {
        return this._currentServiceId;
    }
    
    /**
     * Définit le service actuellement sélectionné
     * @param {string} serviceId - ID du service à sélectionner
     * @returns {boolean} true si le changement a réussi
     */
    setCurrentServiceId(serviceId) {
        if (!this._data[serviceId]) {
            console.error(`Service non trouvé : ${serviceId}`);
            return false;
        }
        
        this._currentServiceId = serviceId;
        StorageService.setSelectedService(serviceId);
        return true;
    }
    
    /**
     * Récupère les données du service actuel
     * @returns {Object} Données du service actuel
     */
    getCurrentServiceData() {
        return this._data[this._currentServiceId];
    }
    
    /**
     * Récupère les données d'un service spécifique
     * @param {string} serviceId - ID du service
     * @returns {Object|null} Données du service ou null si non trouvé
     */
    getServiceData(serviceId) {
        return this._data[serviceId] || null;
    }
    
    /**
     * Récupère tous les services disponibles
     * @returns {Object} Tous les services
     */
    getAllServices() {
        return this._data;
    }
    
    /**
     * Récupère les membres du service actuel
     * @returns {Array} Liste des membres
     */
    getCurrentMembers() {
        const serviceData = this._data[this._currentServiceId];
        
        if (!serviceData) {
            console.error(`Service non trouvé: ${this._currentServiceId}`);
            return [];
        }
        
        if (!serviceData.members) {
            console.error(`Propriété 'members' manquante pour le service: ${this._currentServiceId}`);
            return [];
        }
        
        // Débogage: affichage d'un échantillon des membres
        if (serviceData.members.length > 0) {
            console.log("Exemple de membre:", serviceData.members[0]);
        }
        
        return serviceData.members || [];
    }
    
    /**
     * Récupère les membres d'un service spécifique
     * @param {string} serviceId - ID du service
     * @returns {Array} Liste des membres
     */
    getMembers(serviceId) {
        return this._data[serviceId]?.members || [];
    }
    
    /**
     * Récupère l'index actuel pour le service courant
     * @returns {number} Index actuel
     */
    getCurrentIndex() {
        return this._data[this._currentServiceId]?.currentIndex || 0;
    }
    
    /**
     * Définit l'index actuel pour le service courant
     * @param {number} index - Nouvel index
     * @returns {boolean} true si la mise à jour a réussi
     */
    setCurrentIndex(index) {
        const serviceId = this._currentServiceId;
        const service = this._data[serviceId];
        
        if (!service) {
            console.error(`Service non trouvé: ${serviceId}`);
            return false;
        }
        
        const maxIndex = service.members ? service.members.length - 1 : 0;
        
        // Assure que l'index est dans les limites
        const safeIndex = Math.max(0, Math.min(index, maxIndex));
        
        // Met à jour l'index
        service.currentIndex = safeIndex;
        this._data[serviceId] = service;
        
        // Sauvegarde les modifications
        return StorageService.updateServiceIndex(serviceId, safeIndex);
    }
    
    /**
     * Récupère la date de départ pour le service courant
     * @returns {Date} Date de départ
     */
    getStartDate() {
        const startDate = this._data[this._currentServiceId]?.startDate;
        return startDate ? new Date(startDate) : new Date();
    }
    
    /**
     * Récupère le membre actuel pour le service courant
     * @returns {Object} Membre actuel
     */
    getCurrentMember() {
        const service = this._data[this._currentServiceId];
        if (!service || !service.members || !Array.isArray(service.members)) {
            console.error("Structure du service invalide");
            return null;
        }
        
        const index = service.currentIndex || 0;
        if (index >= service.members.length) {
            console.error(`Index ${index} hors limites pour un tableau de ${service.members.length} membres`);
            return null;
        }
        
        return service.members[index];
    }
    
    /**
     * Récupère le nom du service actuel
     * @returns {string} Nom du service
     */
    getCurrentServiceName() {
        const serviceData = this._data[this._currentServiceId];
        
        if (!serviceData) {
            console.error(`Service non trouvé: ${this._currentServiceId}`);
            return "Service inconnu";
        }
        
        return serviceData.name || "Service sans nom";
    }
    
    /**
     * Récupère tous les allergènes uniques de l'équipe actuelle
     * @returns {Array} Liste des allergènes uniques
     */
    getCurrentAllergenes() {
        const members = this.getCurrentMembers();
        console.log("Recherche d'allergènes parmi", members.length, "membres");
        
        const allergenesSet = new Set();
        
        // Parcourir tous les membres et ajouter leurs allergènes à l'ensemble
        let allergeneCount = 0;
        members.forEach((member, index) => {
            console.log(`Vérification des allergènes pour ${member.name}:`, member.allergenes);
            
            if (member.allergenes && Array.isArray(member.allergenes)) {
                if (member.allergenes.length > 0) {
                    console.log(`${member.name} a ${member.allergenes.length} allergènes:`, member.allergenes);
                    allergeneCount += member.allergenes.length;
                    
                    member.allergenes.forEach(allergene => {
                        allergenesSet.add(allergene);
                    });
                }
            } else {
                console.warn(`Membre ${index} (${member.name}) n'a pas d'allergènes valides`);
            }
        });
        
        console.log(`Total: ${allergeneCount} allergènes trouvés, ${allergenesSet.size} uniques`);
        
        // Convertir l'ensemble en tableau
        const result = Array.from(allergenesSet);
        console.log("Allergènes uniques trouvés:", result);
        return result;
    }
    
    /**
     * Récupère les membres avec des allergènes
     * @returns {Array} Liste des membres ayant des allergènes
     */
    getMembersWithAllergenes() {
        const members = this.getCurrentMembers();
        const membersWithAllergenes = members.filter(member => {
            return member.allergenes && Array.isArray(member.allergenes) && member.allergenes.length > 0;
        });
        
        console.log(`${membersWithAllergenes.length} membres ont des allergènes sur ${members.length} membres`);
        return membersWithAllergenes;
    }
    
    /**
     * Vérifie si l'équipe actuelle contient des allergènes
     * @returns {boolean} true si au moins un membre a des allergènes
     */
    hasAllergenes() {
        return this.getCurrentAllergenes().length > 0;
    }

    /**
     * Récupère les prochains anniversaires de l'équipe actuelle
     * @param {number} count - Nombre d'anniversaires à récupérer
     * @returns {Array} Liste des prochains anniversaires
     */
    getUpcomingBirthdays(count = APP_CONFIG.NOMBRE_ANNIVERSAIRES) {
        const members = this.getCurrentMembers();
        
        // Filtrer les membres qui ont une date d'anniversaire
        const membersWithBirthday = members.filter(member => 
            member.birthdate && member.birthdate.trim() !== '');
        
        if (membersWithBirthday.length === 0) {
            return [];
        }
        
        // Calculer les jours restants pour chaque anniversaire
        const birthdaysWithDays = membersWithBirthday.map(member => {
            const daysRemaining = DateUtils.getNextBirthdayDays(member.birthdate);
            return {
                member,
                daysRemaining,
                formattedDate: DateUtils.formatBirthdate(member.birthdate)
            };
        });
        
        // Trier par proximité (du plus proche au plus éloigné)
        birthdaysWithDays.sort((a, b) => a.daysRemaining - b.daysRemaining);
        
        // Retourner le nombre demandé d'anniversaires
        return birthdaysWithDays.slice(0, count);
    }
}