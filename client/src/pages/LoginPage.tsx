import bgUrl from "../assets/gallery.mp4";
import { AiFillCamera } from "react-icons/ai";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store";
import { GoogleLogin } from "@react-oauth/google";
import { useLogin } from "../hooks/authHooks";

const LoginPage = () => {
  // todo: states
  const user = useSelector(selectUser);

  // todo: functions

  const login = useLogin();

  // todo: return

  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <div className="relative h-screen w-screen flex items-center flex-col">
      {/* the background */}
      <div className="relative w-full h-full">
        <video
          autoPlay
          muted
          controls={false}
          loop
          className="w-full h-full object-cover"
        >
          <source src={bgUrl} type="video/mp4" />
        </video>
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-blackOverlay flex justify-center items-center">
          {/* buttons and logo */}
          <div className="flex flex-col text-white h-full w-full">
            <div className="flex flex-col gap-12 items-center w-full h-full justify-center pt-24">
              <div className="flex flex-col items-center gap-3">
                <p className="text-5xl text-red-400 font-medium">
                  CLIC<span className="text-white">K</span>Y
                </p>
                <AiFillCamera className="text-3xl" />
              </div>

              {/* signin button */}

              <GoogleLogin
                onSuccess={(response: any) => login(response.credential)}
                useOneTap
                auto_select
                ux_mode="popup"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
