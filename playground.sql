\c boxl

SELECT l.league_id, l.name AS league_name, COUNT(ul.user_id) AS member_count
FROM leagues AS l
INNER JOIN users_leagues AS ul ON l.league_id = ul.league_id
WHERE ul.user_id = 1
GROUP BY l.league_id, l.name;
