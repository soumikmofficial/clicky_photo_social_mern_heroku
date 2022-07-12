import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePinsQuery } from "../hooks/pinHooks";
import { MasonryLayout, Spinner } from ".";
import { useLogout } from "../hooks/useLogout";

const Feed = () => {
  const { categoryId } = useParams();
  const {
    isLoading: loadingAllPins,
    data: allPins,
    refetch: fetchAllPins,
    isRefetching: fetchingAllPins,
    error: pinFetchError,
  } = usePinsQuery({});

  const {
    data: pinsByCategory,
    refetch: fetchPinsByCategory,
    isRefetching: fetchingPinsByCategory,
  } = usePinsQuery({ category: categoryId });

  // todo: useEffects
  useEffect(() => {
    if (categoryId) {
      fetchPinsByCategory();
    } else {
      fetchAllPins();
    }
  }, [categoryId, fetchAllPins, fetchPinsByCategory]);

  if (fetchingAllPins || fetchingPinsByCategory || loadingAllPins) {
    return (
      <Spinner
        message={
          categoryId
            ? `more ideas on ${categoryId} on the way`
            : "ideas on the way"
        }
      />
    );
  }
  if (pinFetchError) {
    return (
      <div className="h-full w-full text-gray-500 flex items-center justify-center flex-col">
        <p className="capitalize text-gray-600">
          {pinFetchError.response.data.message}{" "}
        </p>
        <p className="capitalize">you will be redirected to the login page </p>
      </div>
    );
  }
  if (!pinsByCategory && !allPins) {
    return (
      <div className="">
        Unfortunately there is no fin to display at this point
      </div>
    );
  }

  return (
    <section className=" h-full overflow-y-scroll">
      {pinsByCategory ? (
        <MasonryLayout pins={pinsByCategory} />
      ) : (
        <MasonryLayout pins={allPins} />
      )}
    </section>
  );
};

export default Feed;
