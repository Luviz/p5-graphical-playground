import { FC } from "react";
import "./sketchNavigator.css"

export type SketchCardProp = {
  name: string;
  description: string;
  imgPath?: string;
  path: string;
};

export const SketchCard: FC<SketchCardProp> = ({ name, description, path }) => {
  return (
    <div className='sketch-card-container'>
      <a href={path}>
        <div className="sketch-card-name">{name}</div>
        <div className="sketch-card-description">{description}</div>
      </a>
    </div>
  );
};
