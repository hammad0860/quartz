import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import AuthLayer, { AuthConsumer, ProtectedRoute } from "./layers/AuthLayer";
const LoginPage = lazy(() => import("./pages/Login"));
const SignUpPage = lazy(() => import("./pages/SignUp"));
import Dashboard from "./pages/Dashboard";
import * as ROUTES from "./utils/routes";
import "./styles/app.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { CircularProgressLoader } from "./components/CircularLoader";
import { useLocation } from "react-router-dom";

const darkTheme = createTheme({ palette: { mode: "dark" } });

function applyGlobalZoom() {
  document.body.style.zoom = "100%";
  document.documentElement.style.zoom = "100%";
}

function ZoomHandler() {
  const location = useLocation();

  useEffect(() => {
    applyGlobalZoom();
  }, [location]);

  useEffect(() => {
    window.onload = applyGlobalZoom;
  }, []);

  return null;
}

export default function App() {
  return (
    <Router hashType="slash">
      <AuthLayer>
        <AuthConsumer>
          {({ authenticated, login }) => (
            <ThemeProvider theme={darkTheme}>
              <Suspense fallback={<CircularProgressLoader isLoaderInMainApp={true} />}>
                <Switch>
                  <Route
                    exact
                    path={ROUTES.LOGIN}
                    render={(props) => (
                      <LoginPage
                        {...props}
                        login={login}
                        authenticated={authenticated}
                      />
                    )}
                  />
                  <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                  <ProtectedRoute
                    path={ROUTES.DASHBOARD}
                    component={Dashboard}
                    authenticated={authenticated}
                  />
                </Switch>
              </Suspense>
            </ThemeProvider>
          )}
        </AuthConsumer>
      </AuthLayer>
    </Router>
  );
}
