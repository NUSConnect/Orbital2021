//ranks posts based on the number of likes and time posted
//c is a constant to be adjusted.
export const trendingScore = (likes, comments, time, c) => {
//    var z = (likes === 0) ? 1 : likes;
//    var magnitude = (likes === 0) ? 0 : -1;
    var z = (likes <= 0) ? 1 + comments*100 : likes*1000 + comments*100;
    var magnitude = -1;
    return Math.log(z)/Math.log(10) + (magnitude * time)/c;
}

//ranks by time posted, newer posts have a less negative score thus rank higher
export const newScore = (time) => {
    return -1 * time;
}

export const sortByLatest = (x, y) => {
    return y.postTime - x.postTime;
}

export const sortByTrending = (x, y) => {
    return (trendingScore(y.likeCount, y.commentCount, y.postTime, 3000000)
        - trendingScore(x.likeCount, x.commentCount, x.postTime, 3000000));
}

export const sortByLatestForum = (x, y) => {
    return y.postTime - x.postTime;
}

export const sortByTrendingForum = (x, y) => {
    return trendingScore(y.votes, y.commentCount, y.postTime, 3000000)
        - trendingScore(x.votes, x.commentCount, x.postTime, 3000000);
}