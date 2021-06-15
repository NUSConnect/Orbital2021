import * as ranking from "../ranking";

it("trendingScore with all param 0, c=1 returns 0", () => {
    expect(ranking.trendingScore(0,0,0,1)).toBe(0);
});

it("trendingScore with all param 1 returns 2.0413926851582245", () => {
    expect(ranking.trendingScore(1,1,1,1)).toBe(2.0413926851582245);
});

it("newScore with time=0 returns 0", () => {
    expect(ranking.newScore(0)).toBe(-0);
});

it("newScore with time=10 returns -10", () => {
    expect(ranking.newScore(10)).toBe(-10);
});

it("sortByLatest with equal post time returns 0", () => {
    const x = { postTime: 0 };
    const y = { postTime: 0 };
    expect(ranking.sortByLatest(x, y)).toBe(0);
});

it("sortByLatest test with x earlier", () => {
    const x = { postTime: 0 };
    const y = { postTime: 1 };
    expect(ranking.sortByLatest(x, y)).toBe(1);
});

it("sortByLatest test with y earlier", () => {
    const x = { postTime: 1 };
    const y = { postTime: 0 };
    expect(ranking.sortByLatest(x, y)).toBe(-1);
});

it("sortByTrending test with equal stats", () => {
    const x = { likeCount:0, commentCount:0, postTime: 0 };
    const y = { likeCount:0, commentCount:0, postTime: 0 };
    expect(ranking.sortByTrending(x, y)).toBe(0);
});

it("sortByLatestForum with equal post time returns 0", () => {
    const x = { postTime: 0 };
    const y = { postTime: 0 };
    expect(ranking.sortByLatestForum(x, y)).toBe(0);
});

it("sortByLatestForum test with x earlier", () => {
    const x = { postTime: 0 };
    const y = { postTime: 1 };
    expect(ranking.sortByLatestForum(x, y)).toBe(1);
});

it("sortByLatestForum test with y earlier", () => {
    const x = { postTime: 1 };
    const y = { postTime: 0 };
    expect(ranking.sortByLatestForum(x, y)).toBe(-1);
});

it("sortByTrendingForum test with equal stats", () => {
    const x = { votes:0, commentCount:0, postTime: 0 };
    const y = { votes:0, commentCount:0, postTime: 0 };
    expect(ranking.sortByTrendingForum(x, y)).toBe(0);
});