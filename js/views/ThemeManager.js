/**
 * @fileoverview Gestionnaire de thème de l'application
 * Gère le basculement entre les modes clair et sombre
 */

/**
 * Gère le thème de l'application (clair/sombre)
 * @constructor
 */
function ThemeManager() {
    /**
     * Élément d'interrupteur du mode sombre
     * @type {HTMLInputElement|null}
     * @private
     */
    this._darkModeToggle = document.getElementById("toggleDarkMode");
    
    if (!this._darkModeToggle) {
        console.error("Element 'toggleDarkMode' non trouvé dans le DOM");
        return;
    }
    
    /**
     * Initialise le thème en fonction des préférences enregistrées
     * @private
     */
    this._initTheme = function() {
        const isDarkMode = StorageService.getDarkModeState();
        
        if (isDarkMode) {
            document.body.classList.add("dark-mode");
            this._darkModeToggle.checked = true;
        }
    };
    
    /**
     * Gère le basculement du thème
     * @private
     */
    this._handleThemeToggle = function() {
        document.body.classList.toggle("dark-mode");
        const isDarkMode = document.body.classList.contains("dark-mode");
        StorageService.setDarkModeState(isDarkMode);
    };
    
    // Initialise l'état du mode sombre
    this._initTheme();
    
    // Configure l'écouteur d'événement
    this._darkModeToggle.addEventListener("change", () => this._handleThemeToggle());
    
    /**
     * Active le mode sombre
     */
    this.enableDarkMode = function() {
        if (!document.body.classList.contains("dark-mode")) {
            document.body.classList.add("dark-mode");
            this._darkModeToggle.checked = true;
            StorageService.setDarkModeState(true);
        }
    };
    
    /**
     * Désactive le mode sombre
     */
    this.disableDarkMode = function() {
        if (document.body.classList.contains("dark-mode")) {
            document.body.classList.remove("dark-mode");
            this._darkModeToggle.checked = false;
            StorageService.setDarkModeState(false);
        }
    };
    
    /**
     * Vérifie si le mode sombre est activé
     * @returns {boolean} true si le mode sombre est activé
     */
    this.isDarkModeEnabled = function() {
        return document.body.classList.contains("dark-mode");
    };
}