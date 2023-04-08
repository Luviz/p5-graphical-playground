import { FC, useCallback, useEffect, useState } from "react";
import p5Types from "p5";
import Sketch from "react-p5";

type MandelbrotSet2Sketch = {
  size?: number;
  matrix: p5Types.Color[][];
};

const getMandelbrotMatrix = async (size: number, iterations: number) => {
  const p5 = new window.p5(() => {});
  p5.width = size;
  p5.height = size;
  const promises = [];
  for (let y = 0; y < size; y++) {
    const promise = getRowValues(p5, size, y, iterations);
    promises.push(promise);
  }
  return Promise.all(promises);
};

const getRowValues = async (
  p5: p5Types,
  range: number,
  y: number,
  iterations: number
) => {
  const promises = [];

  for (let i = 0; i < range; i++) {
    promises.push(getPixelValue(p5, i, y, iterations));
  }
  return Promise.all(promises);
};

const getPixelValue = async (
  p5: p5Types,
  x: number,
  y: number,
  iterations: number
) => {
  const ret: Promise<p5Types.Color> = new Promise((res) => {
    const range = 2;
    let color = p5.color(100);
    let _realComp = p5.map(x, 0, p5.width, -range, range);
    let _imagComp = p5.map(y, 0, p5.height, -range, range);

    const currentRealComp = _realComp;
    const currentImagComp = _imagComp;

    for (let n = 0; n < iterations; n++) {
      const rc = _realComp * _realComp - _imagComp * _imagComp;
      const ic = 2 * _realComp * _imagComp;
      _realComp = rc + currentRealComp;
      _imagComp = ic + currentImagComp;
      if (rc > iterations) {
        const alpha = p5.map(Math.sqrt(n / iterations), 0, 1, 0, 255);
        const frac = 255 / 6;
        // console.log({y,x, alpha, rd});
        color = p5.color(alpha - frac, alpha - frac * 2, alpha - frac * 3);
        if (alpha < frac) {
          color = p5.color(alpha, 0, 0); // R
        } else if (alpha < frac * 2) {
          color = p5.color(alpha, alpha - frac, 0); // R G
        } else if (alpha < frac * 3) {
          color = p5.color(0, alpha, 0); // G
        } else if (alpha < frac * 4) {
          color = p5.color(0, alpha, alpha - frac); // G B
        } else if (alpha < frac * 5) {
          color = p5.color(0, 0, alpha);
        } else {
          // color = p.color(100)
        }

        break;
      } else {
        color = p5.color(0);
      }
    }
    res(color);
  });
  return ret;
};

export const MandelbrotSet2Sketch: FC = () => {
  const size = 600;
  const [matrix, setMatrix] = useState(
    Array(size).fill(Array(size).fill([200, 0, 200]))
  );
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getMandelbrotMatrix(size, 256).then((m) => {
      setMatrix(m);
      setLoading(false)
    });
  }, []);

  return (
    <div>
      <div>{loading ? 'please wait this might take a while': "Mandelbrot Set"}</div>
      <MandelbrotSet2SketchP5 matrix={matrix} />
    </div>
  );
};

const MandelbrotSet2SketchP5: FC<MandelbrotSet2Sketch> = ({
  size = 600,
  matrix,
}) => {
  console.log("react:in");
  // let matrix = Array(size).fill(Array(size).fill([200, 0, 200]));

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    console.log("started");
    const canvas = p5.createCanvas(size, size);
    canvas.parent(canvasParentRef);
    p5.pixelDensity(1);
    p5.frameRate(1);
    console.log("ended");
  };

  const draw = (p5: p5Types) => {
    // console.time("t");
    const setPixel = (y: number, x: number, color: p5Types.Color) => {
      const d = p5.pixelDensity();
      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          // loop over
          const index = 4 * ((y * d + j) * p5.width * d + (x * d + i));
          p5.pixels[index] = p5.red(color);
          p5.pixels[index + 1] = p5.green(color);
          p5.pixels[index + 2] = p5.blue(color);
          p5.pixels[index + 3] = p5.alpha(color);
        }
      }
    };

    p5.loadPixels();

    for (let y = 0; y < p5.height; y++) {
      for (let x = 0; x < p5.width; x++) {
        // console.log(x,y);

        setPixel(y, x, p5.color(matrix[y][x]));
      }
    }

    p5.updatePixels();
  };

  return <Sketch setup={setup} draw={draw} />;
};
