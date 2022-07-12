import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { QueryClientProvider, QueryClient } from "react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ProtectedRoutes } from "./components";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_OAUTH_CLIENT_ID}`}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/*" element={<HomePage />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
