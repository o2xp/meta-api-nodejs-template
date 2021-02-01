import pjson from "../../package.json";
import request from "supertest";
import app from "../App";
import jwtEncode from "jwt-encode";
import { META_BASE_ROUTE } from "../utils/secrets.helper";

describe("global controller should handle", () => {
  beforeEach(() => {});

  describe("getMetaVersion", () => {
    const getMetaVersion = async () => {
      return await request(app).get(META_BASE_ROUTE + "version");
    };

    it("return version", async () => {
      const res = await getMetaVersion();
      expect(res.body).toEqual(pjson.version);
    });
  });

  describe("getMeta welcome message", () => {
    const getMeta = async () => {
      return await request(app).get(META_BASE_ROUTE);
    };

    it("return message", async () => {
      const res = await getMeta();
      expect(res.body).toEqual({
        message: `Welcome to META v${pjson.version}`,
      });
    });
  });

  it("return 404", async () => {
    const url = "/test/doesntexist";
    const res = await request(app).get(url);
    expect(res.body).toEqual({ url: `${url} not found` });
  });
});

describe("getUserInfo", () => {
  it("Custom User (Other than SUPER_USER)", async () => {
    const bodyExpected = {
      name: "Mahatch K",
      userID: "mahatch",
    };

    // Cookie JWT
    const data = {
      sub: bodyExpected.userID,
      name: bodyExpected.name,
      iat: 1516239022,
    };
    const commonHeader = "am-auth-jwt=" + jwtEncode(data, "secret");

    const res = await request(app)
      .get(META_BASE_ROUTE + "user")
      .set("Cookie", commonHeader);
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(bodyExpected);
  });
});
