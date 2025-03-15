/**
 * @fileoverview Contrôleur principal de l'application
 * Coordonne les différents composants de l'application
 */

/**
 * @class AppController
 * Contrôleur principal de l'application
 */
class AppController {
    /**
     * Crée une instance du contrôleur
     * @constructor
     */
    constructor() {
        // Initialisation du stockage
        StorageService.initStorage();
        
        // Modèles
        this.teamModel = new TeamModel();
        this.rotationModel = new RotationModel(this.teamModel);
        
        // Interface utilisateur
        this.uiManager = new UIManager();
        this.themeManager = new ThemeManager();
        
        // Configure les écouteurs d'événements
        this._setupEventListeners();
    }
    
    /**
     * Configure les écouteurs d'événements
     * @private
     */
    _setupEventListeners() {
        // Écouteur pour le changement de service
        this.uiManager.setupEventListeners((serviceId) => {
            this.changeService(serviceId);
        });
    }
    
    /**
     * Change le service actuel
     * @param {string} serviceId - ID du service à sélectionner
     */
    changeService(serviceId) {
        // Change le service dans le modèle
        this.teamModel.setCurrentServiceId(serviceId);
        
        // Met à jour l'affichage
        this.updateDisplay();
    }
    
    /**
     * Met à jour l'affichage
     * @param {boolean} [forceRotationRecalculation=true] - Force le recalcul de la rotation
     */
    updateDisplay(forceRotationRecalculation = true) {
        // Si forceRotationRecalculation est true, force le recalcul de l'index actuel
        if (forceRotationRecalculation) {
            this.rotationModel.updateCurrentIndex();
        }
        
        // Récupère les informations nécessaires
        const services = this.teamModel.getAllServices();
        const currentServiceId = this.teamModel.getCurrentServiceId();
        const currentMembers = this.teamModel.getCurrentMembers();
        const currentRotation = this.rotationModel.getCurrentRotation();
        const nextRotations = this.rotationModel.getNextRotations();
        const pastRotations = this.rotationModel.getPastRotations();
        const serviceName = this.teamModel.getCurrentServiceName();

        // Récupération des anniversaires
        const upcomingBirthdays = this.teamModel.getUpcomingBirthdays();
        
        // Récupération des fêtes des prénoms
        const upcomingNameDays = this.teamModel.getUpcomingNameDays();
        
        // Récupération des allergènes
        const allergenes = this.teamModel.getCurrentAllergenes();
        const membersWithAllergenes = this.teamModel.getMembersWithAllergenes();
        
        console.log("Mise à jour de l'affichage avec les allergènes:", allergenes);
        console.log("Membres avec allergènes:", membersWithAllergenes);
        
        // Met à jour l'interface utilisateur
        this.uiManager.populateServiceSelector(services, currentServiceId);
        this.uiManager.updateCurrentRotation(currentRotation);
        this.uiManager.updateNextRotations(nextRotations);
        this.uiManager.updateTeamMembers(currentMembers, currentRotation.member);
        this.uiManager.updateHistory(pastRotations, serviceName);
        this.uiManager.updateAllergenes(allergenes, membersWithAllergenes);
        this.uiManager.updateBirthdays(upcomingBirthdays);
        this.uiManager.updateNameDays(upcomingNameDays);
    }
    
    /**
     * Initialise l'application
     */
    init() {
        // Met à jour l'index du responsable actuel
        this.rotationModel.updateCurrentIndex();
        
        // Met à jour l'affichage
        this.updateDisplay(false); // Pas besoin de recalculer car on vient de le faire
        
        // Vérifie si les allergènes sont correctement chargés
        const allergenes = this.teamModel.getCurrentAllergenes();
        if (allergenes && allergenes.length > 0) {
            console.log("Allergènes chargés avec succès:", allergenes);
        } else {
            console.warn("Aucun allergène trouvé après l'initialisation.");
        }
        
        console.log('Application Vendredi initialisée avec succès');
    }
}