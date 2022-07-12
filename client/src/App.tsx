import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { QueryClientProvider, QueryClient } from "react-query";
import { GoogleOAuthProvider, useGoogleOneTapLogin } from "@react-oauth/google";
import { ProtectedRoutes } from "./components";
import { useLogin } from "./hooks/authHooks";

const App = () => {
  const queryClient = new QueryClient();
  const login = useLogin();

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      const token = credentialResponse.credential;
      token && login(token);
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/*" element={<HomePage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
