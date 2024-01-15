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
  test("GET:200 returns an array of league objects", () => {
    return request(app)
      .get("/api/leagues")
      .expect(200)
      .then((response) => {
        const leagues = response.body.leagues;
        console.log(leagues, "LEAGUES IN THE TEST CHAMP");
        expect(leagues.length).toBe(2);
      });
  });
});
