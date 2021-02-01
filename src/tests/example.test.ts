import pjson from "../../package.json";
import request from "supertest";
import app from "../App";
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
