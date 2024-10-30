/*const { HashRouter: Router, Route, Switch } = require("react-router-dom");
const { lazy, Suspense, useEffect } = require("react");
const AuthLayer = require("./layers/AuthLayer");
const { AuthConsumer, ProtectedRoute } = AuthLayer;
const LoginPage = lazy(() => require("./pages/Login"));
const SignUpPage = lazy(() => require("./pages/SignUp"));
const Dashboard = require("./pages/Dashboard");
const ROUTES = require("./utils/routes");
require("./styles/app.css");
const { createTheme, ThemeProvider } = require("@mui/material");
const { CircularProgressLoader } = require("./components/CircularLoader");
const { useLocation } = require("react-router-dom");


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

function App() {
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
module.exports = App;*/

const React = require("react");
const { HashRouter: Router, Route, Switch } = require("react-router-dom");
const { lazy, Suspense, useEffect } = require("react");
const AuthLayer = require("./layers/AuthLayer");
const { AuthConsumer, ProtectedRoute } = AuthLayer;
const LoginPage = lazy(() => require("./pages/Login"));
const SignUpPage = lazy(() => require("./pages/SignUp"));
const Dashboard = require("./pages/Dashboard");
const ROUTES = require("./utils/routes");
require("./styles/app.css");
const { createTheme, ThemeProvider } = require("@mui/material");
const { CircularProgressLoader } = require("./components/CircularLoader");
const { useLocation } = require("react-router-dom");

const darkTheme = createTheme({ palette: { mode: "dark" } });

function App() {
  return React.createElement(
    Router,
    { hashType: "slash" },
    React.createElement(
      AuthLayer,
      null,
      React.createElement(
        AuthConsumer,
        null,
        ({ authenticated, login }) =>
          React.createElement(
            ThemeProvider,
            { theme: darkTheme },
            React.createElement(
              Suspense,
              { fallback: React.createElement(CircularProgressLoader, { isLoaderInMainApp: true }) },
              React.createElement(
                Switch,
                null,
                React.createElement(Route, {
                  exact: true,
                  path: ROUTES.LOGIN,
                  render: (props) =>
                    React.createElement(LoginPage, {
                      ...props,
                      login: login,
                      authenticated: authenticated,
                    }),
                }),
                React.createElement(Route, { path: ROUTES.SIGN_UP, component: SignUpPage }),
                React.createElement(ProtectedRoute, {
                  path: ROUTES.DASHBOARD,
                  component: Dashboard,
                  authenticated: authenticated,
                })
              )
            )
          )
      )
    )
  );
}

module.exports = App;
