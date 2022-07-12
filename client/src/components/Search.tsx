import { useEffect } from "react";
import { usePinsQuery } from "../hooks/pinHooks";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

interface IProps {
  searchTerm: string;
}
const Search: React.FC<IProps> = ({ searchTerm }) => {
  const {
    refetch: searchPins,
    data: searchedPins,
    isRefetching: searchingPins,
  } = usePinsQuery({
    search: searchTerm,
  });

  // todo: useEffects
  useEffect(() => {
    searchPins();
  }, [searchTerm, searchPins]);

  return (
    <div className="w-full h-full flex justify-center">
      {searchingPins && <Spinner message="searching for pins" />}
      {searchedPins &&
        searchedPins.length < 1 &&
        !searchingPins &&
        searchTerm !== "" && (
          <div className="flex items-center justify-center flex-col gap-5">
            <h2 className="text-gray-800">Oops! no pin!</h2>
            <small className="text-gray-600">Try a different search</small>
          </div>
        )}
      {searchedPins && searchedPins.length > 0 && (
        <div className="w-full h-full overflow-scroll">
          <MasonryLayout pins={searchedPins} />
        </div>
      )}
    </div>
  );
};

export default Search;
