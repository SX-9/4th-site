/**
    * @typedef {Object} Repo
    * @property {string} name - The repository name
    * @property {string} desc - The repository description
    * @property {string} url - The repository URL
    * @property {number} stars - The number of stars the repository has
    * @property {string} lang - The repository's primary language

/**
    * Fetches the user's GitHub repositories 
    * @param {number} max - The maximum number of repositories to fetch
    * @param {string} user - The GitHub username
    * @returns {Promise<Repo[]>} - The user's GitHub repositories
    */
export function github(max, user) {
    return fetch(`https://api.github.com/users/${user}/repos?per_page=${max}?type=owner&sort=created`)
        .then(res => res.json())
        .then(data => data.filter(repo => !repo.fork).slice(0, max).map(repo => ({
            name: repo.name,
            desc: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            lang: repo.language,
        }))).catch(() => []);
}

/**
 * @typedef {Object} Music
 * @property {string} art - The Spotify album art URL
 * @property {string} link - The Spotify song link
 * @property {string} song - The Spotify song name
 * @property {string} artist - The Spotify artist name
 */

/**
 * @typedef {Object} Activity
 * @property {string} name - The activity name
 * @property {string} state - The activity state
 * @property {string} details - The activity details
 * @property {number} started - The activity start time
 * @property {Object} images - The activity images
 * @property {string} images.large - The large activity image
 * @property {string} images.small - The small activity image
 */

/**
 * @typedef {Object} User
 * @property {string} username - The user's Discord username
 * @property {string} status - The user's Discord status
 * @property {Music} spotify - The user's Spotify activity
 * @property {Activity[]} activity - The user's Discord activities
 */

/**
 * Fetches the user's Discord status and activities
 * @param {string} id - The Discord user ID
 * @returns {Promise<User>} - The user's Discord status and activities
 */
export function discord(id) {
    return fetch(`https://api.lanyard.rest/v1/users/${id}`)
        .then(res => res.json())
        .then(({data}) => ({
            // avatar: `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=128`,
            username: data.discord_user.username,
            status: data.discord_status,
            spotify: {
                art: data?.spotify?.album_art_url,
                link: `https://open.spotify.com/intl-id/track/${data?.spotify?.track_id}`,
                song: data?.spotify?.song,
                artist: data?.spotify?.artist,
            },
            activity: data?.activities.filter(a=>a.type===0).map((activity) => ({
                name: activity.name,
                started: activity.created_at,
                state: activity.state,
                details: activity.details,
                images: {
                    large: !activity?.assets?.large_image ? '' : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity?.assets?.large_image}.png?size=256`,
                    small: !activity?.assets?.small_image ? '' : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity?.assets?.small_image}.png?size=256`,
                },
            })).sort((a, b) => b.started - a.started) || [],
        })).catch((e) => {
            console.error(e);
            return null;
        });
}
