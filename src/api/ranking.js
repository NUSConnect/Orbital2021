//ranks posts based on the number of likes and time posted
//c is a constant to be adjusted.
export const trendingScore = (likes, time, c) => {
    var z = (likes === 0) ? 1 : likes;
    var magnitude = (likes === 0) ? 0 : -1;
    return Math.log(z)/Math.log(10) + (magnitude * time)/c;
}

//ranks by time posted, newer posts have a less negative score thus rank higher
export const newScore = (time) => {
    return -1 * time;
}

