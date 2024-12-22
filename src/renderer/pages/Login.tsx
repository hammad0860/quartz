import React, { useState, useEffect, useRef, FormEvent, useContext } from "react";
import WAVES from "vanta/dist/vanta.waves.min";
import { Redirect } from "react-router-dom";
import * as ROUTES from "../utils/routes";
import { Grid } from "@mui/material";
import { userLogin } from "services/api.service";
import LoginMolecule from "renderer/components/molecules/Login";
import { AuthConsumer } from "../layers/AuthLayer";

interface LoginPageProps {
  authenticated: boolean;
  login: (email: string, password: string) => void;
}

interface LoginState {
  email: string;
  password: string;
  showPassword: boolean;
  hover: boolean;
  error: string | null;
  logging_in?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ authenticated, login }) => {

  // const { login, logout } = useContext(AuthConsumer);

  const [state, setState] = useState<LoginState>({
    email: "",
    password: "",
    showPassword: false,
    hover: false,
    error: null,
  });
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vantaEffect = WAVES({
      el: vantaRef.current,
      color: 0x50f,
      waveHeight: 16.0,
      waveSpeed: 0.45,
      shininess: 25.0,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
    });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const { email, password } = state;
    if (!validateEmail(email)) {
      setState((prevState) => ({ ...prevState, error: "Invalid email format" }));
      return;
    }
    setState((prevState) => ({ ...prevState, logging_in: true }));
    const authenticated = await userLogin(email, password);
    if (authenticated.accessToken) {
      // setState((prevState) => ({ ...prevState, logging_in: true }));
      await login(email, password);
    } else {
      setState((prevState) => ({
        ...prevState,
        error: authenticated.errorMessage,
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  const hoverChangeHandle = () => {
    setState((prevState) => ({
      ...prevState,
      hover: !prevState.hover,
    }));
  };

  const handleUpdate = (error: string) => {
    setState((prevState) => ({ ...prevState, error }));
  };

  if (authenticated) {
    return (
      <div ref={vantaRef}>
        <Redirect to={ROUTES.DASHBOARD} />
      </div>
    );
  } else {
    return (
      <Grid 
        container
        justifyContent="center"
        alignItems="center"
        ref={vantaRef}
        style={{ height: "100vh",
        
        }}
      >
        <Grid item xs ={12} sm={6} md = {6} lg = {4}>
          

          <LoginMolecule
          
            onEmailChange={(e) => setState({ ...state, email: e.target.value })}
            onPasswordChange={(e) => setState({ ...state, password: e.target.value })}
            onToggleVisible={togglePasswordVisibility}
            state={state}
            handleLogin={handleLogin}
            handleUpdate={handleUpdate}
            signupRoute={ROUTES.SIGN_UP}
          />
        </Grid>
      </Grid>
    );
  }
};

export default LoginPage;
