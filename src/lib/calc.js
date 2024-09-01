/**
 * Calculate the number of days until the next birthday
 * @param {number[]} date - The birthday date as an array [day, month]
 * @returns {number} The number of days until the next birthday
 */
export function daysUntilBirthday(date) {
    const today = new Date();
    const birthday = new Date(today.getFullYear(), date[1] - 1, date[0]);
    if (today > birthday) {
        birthday.setFullYear(today.getFullYear() + 1);
    }
    // @ts-ignore
    return Math.ceil((birthday - today) / 86400000);
}

/**
 * Get the current time in the specified timezone
 * @param {string} timezone - The timezone to get the time in
 * @returns {string} The current time in the specified timezone
 */
export function getTimeIn(timezone) {
    const options = { timeZone: timezone, hour12: true, hour: 'numeric', minute: 'numeric' };
    // @ts-ignore
    const time = new Date().toLocaleString("en-US", options);
    return time;
}

/**
 * Get time ago from a Unix timestamp
 * @param {number} unixTimestamp - The Unix timestamp
 * @returns {string} The time ago from the Unix timestamp
 */
export function timeAgo(unixTimestamp) {
    const date = new Date(unixTimestamp);
    // @ts-ignore
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}