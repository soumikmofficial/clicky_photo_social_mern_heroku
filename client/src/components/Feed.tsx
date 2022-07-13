import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePinsQuery } from "../hooks/pinHooks";
import { MasonryLayout, Spinner } from ".";
import { useLogout } from "../hooks/authHooks";

const Feed = () => {
  const { categoryId } = useParams();
  const logout = useLogout();
  const navigate = useNavigate();

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

  // todo: functions
  const handleErrorRedirect = () => {
    logout();
    navigate("/login");
  };

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
        <div className="capitalize flex flex-col gap-4 items-center">
          <p>something went wrong... please try logging back in</p>
          <button
            className="bg-dark2 p-2 w-max rounded-md text-white"
            onClick={handleErrorRedirect}
          >
            Login
          </button>
        </div>
      </div>
    );
  }
  if (!pinsByCategory && !allPins) {
    return (
      <div className="w-full flex items-center justify-center">
        Unfortunately there is no pin to display at this point
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
