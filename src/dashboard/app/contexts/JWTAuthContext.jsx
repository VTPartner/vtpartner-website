/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { serverEndPoint } from "../constants";

const token = Cookies.get("authToken");
if (token) {
  console.log("Authenticated user token:", token);
}

// CUSTOM COMPONENT
import { MatxLoading } from "/src/dashboard/app/components";

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialized: true, user };
    }

    case "LOGIN": {
      return { ...state, isAuthenticated: true, user: action.payload.user };
    }

    case "LOGOUT": {
      return { ...state, isAuthenticated: false, user: null };
    }

    case "REGISTER": {
      const { user } = action.payload;

      return { ...state, isAuthenticated: true, user };
    }

    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
  login: () => {},
  logout: () => {},
  register: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    // Check if the user is offline
    if (!navigator.onLine) {
      throw new Error("No Internet Connection");
    }

    try {
      const response = await axios.post(
        serverEndPoint + "/login",
        {
          email,
          password,
        },
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        //   },
        // },
        { timeout: 5000 } // 5 seconds timeout
      );

      const { token, user } = response.data; // assuming your backend sends a token and user info

      // Store the token in cookies
      Cookies.set("authToken", token, { expires: 1 }); // token stored for 1 day
      console.log(user);

      // Store user data in the state or context
      dispatch({ type: "LOGIN", payload: { user } });
    } catch (error) {
      // Differentiate between errors
      if (error.code === "ECONNABORTED") {
        // Handle timeout error
        throw new Error("Request Timeout: Server took too long to respond");
      } else if (error.response) {
        // Server responded with a status code other than 200
        if (error.response.status === 404) {
          throw new Error("No Data Found");
        } else if (error.response.status === 500) {
          throw new Error("Internal Server Error");
        }
      } else if (error.request) {
        // Request was made but no response was received
        throw new Error("Server Down or No Response from Server");
      }

      console.error("Login error:", error);
      throw error; // Propagate the error to be handled in the calling function
    }
  };

  const register = async (email, username, password) => {
    const response = await axios.post("/api/auth/register", {
      email,
      username,
      password,
    });
    const { user } = response.data;

    dispatch({ type: "REGISTER", payload: { user } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/auth/profile");
        dispatch({
          type: "INIT",
          payload: { isAuthenticated: true, user: data.user },
        });
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INIT",
          payload: { isAuthenticated: false, user: null },
        });
      }
    })();
  }, []);

  // SHOW LOADER
  if (!state.isInitialized) return <MatxLoading />;

  return (
    <AuthContext.Provider
      value={{ ...state, method: "JWT", login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
