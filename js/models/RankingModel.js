class RankingModel {
    constructor() {
        this._storageKey = 'VendrediRanking';
        this._rankings = this._loadRankings();
    }
    
    _loadRankings() {
        try {
            const data = localStorage.getItem(this._storageKey);
            return data ? JSON.parse(data) : {
                members: {},      // Scores par membre
                history: []       // Historique des évaluations
            };
        } catch (e) {
            console.error('Erreur lors du chargement des classements:', e);
            return { members: {}, history: [] };
        }
    }
    
    _saveRankings() {
        try {
            localStorage.setItem(this._storageKey, JSON.stringify(this._rankings));
            return true;
        } catch (e) {
            console.error('Erreur lors de la sauvegarde des classements:', e);
            return false;
        }
    }
    
    // Ajoute une évaluation pour un tour de croissants
    addRating(data) {
        const { serviceId, memberId, memberName, date, rating, comment, voters } = data;
        
        // Validation
        if (!serviceId || !memberId || rating === undefined || !date) {
            console.error('Données incomplètes pour l\'évaluation');
            return false;
        }
        
        // Crée l'entrée dans le membre si nécessaire
        if (!this._rankings.members[memberId]) {
            this._rankings.members[memberId] = {
                totalScore: 0,
                ratingCount: 0,
                averageScore: 0,
                history: []
            };
        }
        
        // ID unique pour cette évaluation
        const ratingId = Date.now();
        
        // Crée l'entrée d'évaluation
        const ratingEntry = {
            id: ratingId,
            serviceId: serviceId,
            memberId: memberId,
            memberName: memberName,
            date: new Date(date).toISOString(),
            rating: rating,
            comment: comment || '',
            voters: voters || [],
            timestamp: Date.now()
        };
        
        // Met à jour les scores du membre
        this._rankings.members[memberId].totalScore += rating;
        this._rankings.members[memberId].ratingCount += 1;
        this._rankings.members[memberId].averageScore = 
            this._rankings.members[memberId].totalScore / this._rankings.members[memberId].ratingCount;
        this._rankings.members[memberId].history.push(ratingId);
        
        // Ajoute à l'historique global
        this._rankings.history.push(ratingEntry);
        
        // Sauvegarde
        return this._saveRankings();
    }
    
    // Obtient le classement des membres
    getMemberRankings(serviceId = null) {
        const rankings = [];
        
        // Filtre par service si spécifié
        const historyMap = this._rankings.history.reduce((map, entry) => {
            if (!serviceId || entry.serviceId === serviceId) {
                if (!map[entry.memberId]) {
                    map[entry.memberId] = {
                        memberId: entry.memberId,
                        memberName: entry.memberName,
                        totalScore: 0,
                        ratingCount: 0
                    };
                }
                map[entry.memberId].totalScore += entry.rating;
                map[entry.memberId].ratingCount += 1;
            }
            return map;
        }, {});
        
        // Calcule les moyennes et prépare le classement
        for (const [memberId, data] of Object.entries(historyMap)) {
            if (data.ratingCount > 0) {
                rankings.push({
                    memberId: memberId,
                    memberName: data.memberName,
                    averageScore: data.totalScore / data.ratingCount,
                    totalScore: data.totalScore,
                    ratingCount: data.ratingCount
                });
            }
        }
        
        // Trie par score moyen (du plus haut au plus bas)
        rankings.sort((a, b) => b.averageScore - a.averageScore);
        
        return rankings;
    }
    
    // Obtient l'historique des évaluations d'un membre
    getMemberRatingHistory(memberId) {
        return this._rankings.history.filter(entry => entry.memberId === memberId);
    }
    
    // Obtient l'historique des évaluations récentes
    getRecentRatings(limit = 5) {
        return [...this._rankings.history]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
}