/**
 * @typedef {Object} Participant
 * @property {string} nom - Le nom du participant
 * @property {string[]} allergenes - Liste des allergènes du participant
 */

/**
 * @typedef {Object} Equipe
 * @property {Participant[]} participants - Liste des participants de l'équipe
 */

/**
 * @type {Object.<string, Equipe>}
 * @description Objet contenant toutes les équipes disponibles, indexées par leur nom de fichier
 * @example
 * {
 *   "equipe_oifp.js": {
 *     participants: [
 *       { nom: "John", allergenes: ["gluten"] }
 *     ]
 *   }
 * }
 */
const equipes = {
    "equipe_oifp.js": equipeOIFP,
    "equipe_marketing.js": equipeMarketing,
    "equipe_pirate.js": equipePirate,
};

/**
 * Charge les participants d'une équipe à partir de son identifiant de fichier
 * @param {string} fichier - L'identifiant du fichier de l'équipe (ex: "equipe_oifp.js")
 * @returns {Participant[]|undefined} La liste des participants de l'équipe ou undefined si l'équipe n'existe pas
 * @throws {Error} Si l'équipe n'est pas trouvée
 * @example
 * const participants = chargerEquipe("equipe_oifp.js");
 * if (participants) {
 *   console.log(participants[0].nom); // "Mathieu"
 * }
 */
function chargerEquipe(fichier) {
    const data = equipes[fichier];

    if (!data) {
        console.error("Équipe non trouvée :", fichier);
        return;
    }

    return data.participants;
}