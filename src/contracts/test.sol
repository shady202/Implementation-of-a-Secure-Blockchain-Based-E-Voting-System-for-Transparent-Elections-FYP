// Election results endpoint with blockchain verification
app.get('/api/elections/:electionId/results', requireAuth, async (req, res) => {
    const { electionId } = req.params;
    try {
        // Fetch election configuration
        const election = await pool.query(
            'SELECT * FROM elections WHERE id = $1',
            [electionId]
        );
        if (election.rows.length === 0) {
            return res.status(404).json({ error: 'Election not found' });
        }
        const electionData = election.rows[0];
        // Check if results should be visible
        const now = new Date();
        const electionEnded = new Date(electionData.end_date) < now;
        const showResults = electionData.show_results_during_voting || electionEnded;
        if (!showResults) {
            return res.status(403).json({ 
                error: 'Results not available until election ends' 
            });
        }
        // Fetch categories with candidates and vote counts
        const results = await pool.query(`
            SELECT 
                cat.id as category_id,
                cat.name as category_name,
                cat.description as category_description,
                json_agg(
                    json_build_object(
                        'id', cand.id,
                        'name', cand.name,
                        'party', cand.party,
                        'voteCount', COALESCE(vote_counts.count, 0),
                        'percentage', ROUND(
                            (COALESCE(vote_counts.count, 0)::numeric / 
                             NULLIF(category_totals.total, 0) * 100), 2
                        )
                    ) ORDER BY COALESCE(vote_counts.count, 0) DESC
                ) as candidates
            FROM categories cat
            LEFT JOIN candidates cand ON cat.id = cand.category_id
            LEFT JOIN (
                SELECT candidate_id, COUNT(*) as count
                FROM vote_history
                WHERE election_id = $1
                GROUP BY candidate_id
            ) vote_counts ON cand.id = vote_counts.candidate_id
            LEFT JOIN (
                SELECT category_id, COUNT(*) as total
                FROM vote_history
                WHERE election_id = $1
                GROUP BY category_id
            ) category_totals ON cat.id = category_totals.category_id
            WHERE cat.election_id = $1 AND cat.is_active = true
            GROUP BY cat.id, cat.name, cat.description, category_totals.total
            ORDER BY cat.display_order
        `, [electionId]);
        // Get total participation statistics
        const stats = await pool.query(`
            SELECT 
                COUNT(DISTINCT voter_id) as total_voters,
                COUNT(*) as total_votes
            FROM vote_history
            WHERE election_id = $1
        `, [electionId]);
        res.json({
            election: {
                id: electionData.id,
                title: electionData.title,
                startDate: electionData.start_date,
                endDate: electionData.end_date,
                isActive: electionData.is_active
            },
            statistics: {
                totalVoters: parseInt(stats.rows[0].total_voters),
                totalVotes: parseInt(stats.rows[0].total_votes)
            },
            categories: results.rows
        });
    } catch (error) {
        console.error('Results retrieval error:', error);
        res.status(500).json({ 
            error: 'Failed to retrieve election results' 
        });
    }
});