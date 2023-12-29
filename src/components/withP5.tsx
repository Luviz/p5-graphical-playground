import p5 from "p5";
import p5Types from "p5";
import { FC, useEffect, useRef } from "react";

type WithP5Props = {
  sketch: (p5: p5Types) => void;
};

export const WithP5: FC<WithP5Props> = ({ sketch }) => {
  const p5Ref = useRef<any>();

  useEffect(() => {
    const p5Instance = new p5(sketch, p5Ref.current);
    return () => p5Instance.remove();
  }, [sketch]);

  return <div ref={p5Ref} />;
};
