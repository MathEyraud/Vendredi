/**
 * @fileoverview Contrôleur principal de l'application
 * Coordonne les différents composants de l'application
 */

/**
 * Contrôleur principal de l'application
 * @constructor
 */
function AppController() {
    // Crée les instances des modèles
    this._equipeModel = new EquipeModel();
    this._rotationModel = new RotationModel(APP_CONFIG.DATE_DEPART);
    
    // Crée les instances des vues
    this._uiManager = new UIManager();
    this._themeManager = new ThemeManager();
    this._countdownView = new CountdownView();
    
    // Crée les instances des contrôleurs
    this._equipeController = new EquipeController(
        this._equipeModel,
        this._rotationModel,
        this._uiManager
    );
    
    /**
     * Initialise l'application
     */
    this.init = function() {
        // Affiche les données de l'équipe par défaut
        this._equipeController.initialiserAffichage();
        
        console.log("Application Vendredi initialisée avec succès");
    };
}