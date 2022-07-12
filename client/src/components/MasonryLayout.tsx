import React from "react";
import { IPin } from "../types/api";
import Masonry from "react-masonry-css";
import SinglePin from "./SinglePin";

interface IProps {
  pins: IPin[] | undefined;
}

const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 3,
  500: 2,
  400: 2,
};

const MasonryLayout: React.FC<IProps> = ({ pins }) => {
  if (!pins) return <></>;
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex animate-slide-fwd gap-3"
    >
      {pins?.map((pin) => (
        <SinglePin pin={pin} key={pin._id} />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
