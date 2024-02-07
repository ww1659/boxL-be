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
    expect(leagues.length).toBe(3);
    leagues.forEach((league) => {
      expect(typeof league.league_id).toBe("number");
      expect(typeof league.name).toBe("string");
      expect(typeof league.admin).toBe("number");
      expect(typeof league.start_date).toBe("string");
      expect(typeof league.end_date).toBe("string");
      expect(typeof league.format).toBe("string");
    });
  });
  test("GET:404 returns status 404 for a non-existent path", async () => {
    const response = await request(app).get("/api/league").expect(404);
    expect(response.body).toEqual({ msg: "path does not exist" });
  });
});

describe("GET api/leagues/:userId", () => {
  test("GET:200 returns a single league for a desired user id", async () => {
    const response = await request(app).get("/api/leagues/1").expect(200);
    const leagues = response.body.leaguesByUserId;
    expect(leagues[0]).toMatchObject({
      name: "CSL",
      admin: 2,
      start_date: expect.any(String),
      end_date: expect.any(String),
      location: "whatever",
      format: "round robin",
    });
  });
  test("GET:200 returns an array of leagues for a desired user id", async () => {
    const response = await request(app).get("/api/leagues/3").expect(200);
    const leagues = response.body.leaguesByUserId;
    expect(leagues.length).toBe(2);
    leagues.forEach((league) => {
      expect(typeof league.league_id).toBe("number");
      expect(typeof league.name).toBe("string");
      expect(typeof league.admin).toBe("number");
      expect(typeof league.start_date).toBe("string");
      expect(typeof league.end_date).toBe("string");
      expect(typeof league.format).toBe("string");
    });
  });
  test("GET:200 returns message when user exists but is not a member of a league", async () => {
    const response = await request(app).get("/api/leagues/5").expect(200);
    expect(response.body).toEqual({ msg: "user is not in any leagues" });
  });
  test("GET:404 returns status 404 for a non-existent user", async () => {
    const response = await request(app).get("/api/leagues/6").expect(404);
    expect(response.body).toEqual({ msg: "user does not exist" });
  });
  test("GET:400 returns status 400 for a invalid user id", async () => {
    const response = await request(app).get("/api/leagues/test").expect(400);
    expect(response.body).toEqual({ msg: "invalid id" });
  });
});

describe("GET api/results/leagues/:leagueId", () => {
  test("GET:200 returns an array of results for a desired league", async () => {
    const response = await request(app)
      .get("/api/results/leagues/1")
      .expect(200);
    const results = response.body.resultsByLeagueId;
    expect(results.length).toBe(7);
    expect(results[0]).toMatchObject({
      league_id: 1,
      winner_id: 1,
      loser_id: 2,
      first_set_score: "6-4",
      first_set_tiebreak: "",
      second_set_score: "3-6",
      second_set_tiebreak: "",
      third_set_score: "",
      third_set_tiebreak: "",
      championship_tiebreak: true,
      championship_tiebreak_score: "10-8",
      match_date: expect.any(String),
      location: "cotham park tennis club",
      court_number: 3,
      court_surface: "articifical clay",
      match_notes: "first match of the spring box league",
    });
  });
  test("GET:404 returns status 404 for a non-existent league", async () => {
    const response = await request(app)
      .get("/api/results/leagues/4")
      .expect(404);
    expect(response.body).toEqual({ msg: "league does not exist" });
  });
  test("GET:404 returns status 404 when there are no results for a league", async () => {
    const response = await request(app)
      .get("/api/results/leagues/3")
      .expect(404);
    expect(response.body).toEqual({ msg: "no results for this league" });
  });
  test("GET:400 returns status 400 for a invalid league id", async () => {
    const response = await request(app)
      .get("/api/results/leagues/hello")
      .expect(400);
    expect(response.body).toEqual({ msg: "invalid id" });
  });
});

describe("GET api/results/users/:userId", () => {
  test("GET:200 returns an array of results for a desired user", async () => {
    const response = await request(app).get("/api/results/users/1").expect(200);
    const results = response.body.resultsByUserId;
    expect(results.length).toBe(5);
    results.forEach((result) => {
      expect(typeof result.result_id).toBe("number");
      expect(typeof result.league_id).toBe("number");
      expect(typeof result.winner_id).toBe("number");
      expect(typeof result.loser_id).toBe("number");
      expect(typeof result.first_set_score).toBe("string");
      expect(typeof result.first_set_tiebreak).toBe("string");
      expect(typeof result.second_set_score).toBe("string");
      expect(typeof result.second_set_tiebreak).toBe("string");
      expect(typeof result.third_set_score).toBe("string");
      expect(typeof result.third_set_tiebreak).toBe("string");
      expect(typeof result.championship_tiebreak).toBe("boolean");
      expect(typeof result.championship_tiebreak_score).toBe("string");
      expect(typeof result.match_date).toBe("string");
      expect(typeof result.location).toBe("string");
      expect(typeof result.court_number).toBe("number");
      expect(typeof result.court_surface).toBe("string");
      expect(typeof result.match_notes).toBe("string");
    });
  });
  test("GET:404 returns status 404 for no results for a user", async () => {
    const response = await request(app).get("/api/results/users/5").expect(404);
    expect(response.body).toEqual({ msg: "no results for this user" });
  });
  test("GET:404 returns status 404 for a non-existent user", async () => {
    const response = await request(app).get("/api/results/users/7").expect(404);
    expect(response.body).toEqual({ msg: "user does not exist" });
  });
  test("GET:400 returns status 400 for a invalid user id", async () => {
    const response = await request(app)
      .get("/api/results/users/hello")
      .expect(400);
    expect(response.body).toEqual({ msg: "invalid id" });
  });
});

//POST TESTS
describe("POST api/users", () => {
  test("POST:201 returns status 201 for a successfully created user", async () => {
    const testUser = {
      username: "test_username",
      name: "test user",
      email: "test_user@gmail.com",
      password: "test_password",
      avatar_url: "",
      club: "test tennis club",
    };
    const response = await request(app)
      .post("/api/users")
      .send(testUser)
      .expect(201);
    expect(response.body.newUser).toEqual({
      user_id: 6,
      username: "test_username",
      name: "test user",
      email: "test_user@gmail.com",
      avatar_url: "",
      club: "test tennis club",
    });
    expect(response.body.msg).toBe("new user created");
  });
  test("POST:400 returns status 400 for a short password", async () => {
    const testUser = {
      username: "test_username",
      name: "test user",
      email: "test_user@gmail.com",
      password: "short",
      avatar_url: "",
      club: "test tennis club",
    };
    const response = await request(app)
      .post("/api/users")
      .send(testUser)
      .expect(400);
    expect(response.body.msg).toBe(
      "password must be at least 8 characters long"
    );
  });
  test("POST:400 returns status 400 and msg for user without username value", async () => {
    const testUser = {
      username: "",
      name: "test user",
      email: "test_user@gmail.com",
      password: "passwordFine",
      avatar_url: "",
      club: "test tennis club",
    };
    const response = await request(app)
      .post("/api/users")
      .send(testUser)
      .expect(400);
    expect(response.body.msg).toBe("missing user data");
  });
});

describe("POST api/results", () => {
  test("POST:201 returns status 201 for a successfully entered result", async () => {
    const testResult = {
      league_id: 1,
      winner_id: 1,
      loser_id: 2,
      first_set_score: "7-5",
      first_set_tiebreak: "",
      second_set_score: "6-7",
      second_set_tiebreak: "7-9",
      third_set_score: "",
      third_set_tiebreak: "",
      championship_tiebreak: 1,
      championship_tiebreak_score: "10-1",
      match_date: "2024-02-27",
      location: "cotham park tennis club",
      court_number: 3,
      court_surface: "articifical clay",
      match_notes: "test result to be entered",
    };
    const response = await request(app)
      .post("/api/results")
      .send(testResult)
      .expect(201);
    expect(response.body.result).toEqual({
      result_id: 11,
      league_id: 1,
      winner_id: 1,
      loser_id: 2,
      first_set_score: "7-5",
      first_set_tiebreak: "",
      second_set_score: "6-7",
      second_set_tiebreak: "7-9",
      third_set_score: "",
      third_set_tiebreak: "",
      championship_tiebreak: true,
      championship_tiebreak_score: "10-1",
      match_date: expect.any(String),
      location: "cotham park tennis club",
      court_number: 3,
      court_surface: "articifical clay",
      match_notes: "test result to be entered",
    });
    expect(response.body.msg).toBe("new result entered");
  });
  test("POST:400 returns status 400 and msg for result without a necessary value", async () => {
    const testResult = {
      league_id: 1,
      loser_id: 2,
      first_set_score: "7-5",
      first_set_tiebreak: "",
      second_set_score: "6-7",
      second_set_tiebreak: "7-9",
      third_set_score: "",
      third_set_tiebreak: "",
      championship_tiebreak: 1,
      championship_tiebreak_score: "10-1",
      match_date: "2024-02-27",
      location: "cotham park tennis club",
      court_number: 3,
      court_surface: "articifical clay",
      match_notes: "test result to be entered",
    };
    const response = await request(app)
      .post("/api/results")
      .send(testResult)
      .expect(400);
    expect(response.body.msg).toBe("missing results data");
  });
});

describe.only("POST api/users/login", () => {
  test("POST:201 returns status 201 for a successfully logged in user", async () => {
    const testUser = {
      username: "billy",
      password: "hashed_password_1",
    };
    const response = await request(app)
      .post("/api/users/login")
      .send(testUser)
      .expect(201);
    expect(response.body.status).toBe(true);
    expect(response.body.user).toMatchObject({
      username: "billy",
      name: "billy white",
      email: "testemail@gmail.com",
      avatar_url: "",
      club: "Cotham Park",
    });

    expect(response.body.msg).toBe("authentication successful");
  });
  test("POST:400 returns status 400 for an incorrect password", async () => {
    const testUser = {
      username: "billy",
      password: "thisPasswordWillFail",
    };
    const response = await request(app)
      .post("/api/users/login")
      .send(testUser)
      .expect(400);
    expect(response.body.status).toBe(false);
    expect(response.body.msg).toBe("authentication failed: incorrect password");
  });
  test("POST:400 returns status 400 for an incorrect username", async () => {
    const testUser = {
      username: "notAuser",
      password: "meaningless",
    };
    const response = await request(app)
      .post("/api/users/login")
      .send(testUser)
      .expect(400);
    expect(response.body.msg).toBe("username does not exist");
  });
});
