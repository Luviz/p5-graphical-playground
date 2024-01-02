import p5Types from "p5";
import { join } from "string-ts";

const ROOT_PATH = "/shaders" as const;
const COMMON_VERT_PATH = `${ROOT_PATH}/common.vert` as const;

const shadersPaths = {
  shaderTest: {
    vertPath: COMMON_VERT_PATH,
    fragPath: join([ROOT_PATH, "shaderTest", "shader.frag"], "/"),
  },
  shaderTest2: {
    vertPath: COMMON_VERT_PATH,
    fragPath: join([ROOT_PATH, "shaderTest2", "shader.frag"], "/"),
  },
  rayMarching: {
    vertPath: COMMON_VERT_PATH,
    fragPath: join([ROOT_PATH, "rayMarching", "rayMarching.frag"], "/"),
  },
  shaderTestCircle: {
    vertPath: COMMON_VERT_PATH,
    fragPath: join([ROOT_PATH, "shapeDistanceFn", "circle.frag"], "/"),
  },
  shaderTestRectangle: {
    vertPath: COMMON_VERT_PATH,
    fragPath: join([ROOT_PATH, "shapeDistanceFn", "rect.frag"], "/"),
  },
  shaderTestCross: {
    vertPath: COMMON_VERT_PATH,
    fragPath: join([ROOT_PATH, "shapeDistanceFn", "cross.frag"], "/"),
  },
  shaderTestBoolean: {
    vertPath: COMMON_VERT_PATH,
    fragPath: join([ROOT_PATH, "shapeDistanceFn", "boolean.frag"], "/"),
  },
};

export const loadShader = (p5: p5Types, key: keyof typeof shadersPaths) =>
  p5.loadShader(shadersPaths[key].vertPath, shadersPaths[key].fragPath);
