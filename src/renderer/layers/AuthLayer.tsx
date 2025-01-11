import React, { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import decode from "jwt-decode";
import * as ROUTES from "../utils/routes";
import { userLogin } from "../../services/api.service";

const ACCESS_TOKEN = "access_token";
const AuthContext = createContext<AuthLayerState | undefined>(undefined);

interface AuthLayerState {
  authenticated: boolean;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
}

interface AuthLayerProps {
  children: ReactNode;
}

const AuthLayer: React.FC<AuthLayerProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    setAuthenticated(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const authenticated = await userLogin(email, password);
      if (authenticated) {
        setAuthenticated(true);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }, []);

  const updateAuth = useCallback((accessToken: string) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    setAuthenticated(true);
  }, []);

  useEffect(() => {
    if (localStorage.hasOwnProperty(ACCESS_TOKEN)) {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        const decodedToken = decode(token) as any;
        const expired = Date.now() > decodedToken.exp;
        setAuthenticated(!expired);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

interface ProtectedRouteProps extends RouteProps {
  authenticated: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ authenticated, ...routeProps }) => {
  return authenticated ? (
    <Route {...routeProps} />
  ) : (
    <Redirect to={ROUTES.LOGIN} />
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


export const AuthConsumer = AuthContext.Consumer;
export default AuthLayer;
