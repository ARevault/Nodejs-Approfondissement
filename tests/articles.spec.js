const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");

describe("tester Création, MAJ et suppression des Articles", () => {
  let token;
  const USER_ID = "fakeID";
  const MOCK_DATA = [
    {
      _id: USER_ID,
      name: "Antonin",
      email: "antonin@gmail.com",
      password: "azertyuiop",
      role:'admin'
    },
  ];
  const MOCK_DATA_CREATED = {
    title: "Test Article",
    content: "Contenu Article",
    user: MOCK_DATA._id,
    status: "published",
  };
  const MOCK_DATA_UPDATED = {
    title: "Nouveau titre",
    content: "Nouveau contenu",
    user: MOCK_DATA._id,
    status: "draft",
  }; 

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    // mongoose.Query.prototype.find = jest.fn().mockResolvedValue(MOCK_DATA);
    mockingoose(User).toReturn(MOCK_DATA, "find");
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");
    //mockingoose(Article).toReturn(MOCK_DATA_CREATED, "update");
  });

  test("[Articles] create", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    console.log(res.body)
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  test("[Articles] update", async () => {

    const article = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    console.log(article.body._id);
    const res = await request(app)
      .put(`/api/articles/${article.body._id}`)
      .send(MOCK_DATA_UPDATED)
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    console.log(res.body)
    expect(res.body.title).toBe(MOCK_DATA_UPDATED.title); 
  });

  test("[Articles] delete", async () => {
    const article = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    
    const res = await request(app)
      .delete(`/api/articles/${article.body._id}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);

    const resget = await request(app)
      .get(`/api/articles/${article.body._id}`)
      .set("x-access-token", token);
    expect(resget.status).toBe(500);
  });
});
