const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});
afterAll(() => db.end());

//GET TESTS
describe("GET api/leagues", () => {
  test("GET:200 returns an array of league objects", async () => {
    const response = await request(app).get("/api/leagues").expect(200);
    const leagues = response.body.leagues;
    expect(leagues.length).toBe(2);
    leagues.forEach((league) => {
      expect(typeof league.league_id).toBe("number");
      expect(typeof league.name).toBe("string");
      expect(typeof league.admin).toBe("number");
      expect(typeof league.created_at).toBe("string");
      expect(typeof league.format).toBe("string");
    });
  });
  test("GET:404 returns status 404 for a non-existent path", async () => {
    const response = await request(app).get("/api/league").expect(404);
    expect(response.body).toEqual({ msg: "path does not exist" });
  });
});
