/**
 * @fileoverview Point d'entrée principal de l'application
 * Initialise l'application une fois le DOM chargé
 */

// Initialise l'application lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Vérifie si l'élément des allergènes existe
        const allergenesContainer = document.getElementById('allergenesContainer');
        if (allergenesContainer) {
            console.log("L'élément allergenesContainer existe dans le DOM");
        } else {
            console.error("L'élément allergenesContainer n'existe pas dans le DOM");
        }
        
        // IMPORTANT: Réinitialisation du localStorage pour charger les dernières données
        // Chargement des données fraîches depuis les fichiers d'équipe
        console.log("Réinitialisation du localStorage pour charger les allergènes...");
        StorageService.resetStorage();
        
        // Crée et initialise le contrôleur principal
        const app = new AppController();
        app.init();
        
    } catch (error) {
        // Affiche les erreurs dans la console
        console.error("Erreur lors de l'initialisation de l'application :", error);
        
        // Affiche également un message d'erreur visible à l'utilisateur
        const container = document.querySelector(".container");
        if (container) {
            container.innerHTML = `
                <div style="color: red; text-align: center; padding: 20px;">
                    <h2>Erreur d'initialisation</h2>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
});