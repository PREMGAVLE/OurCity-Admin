import { createContext, useContext, useState, useEffect } from "react";

import axios from "../../axios";
import { errorToast } from "../../utils/toast";

import { Riple } from "react-loading-indicators";

const AuthenticationContext = createContext(null);

const Authentication = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [loading, setLoading] = useState(true);
//   const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    axios
      .get("me")
      .then((response) => {
        setLoading(false);
        setAuthenticatedUser(response.data);
        // setUser(response.data);
      })
      .catch((err) => {
        setLoading(false);
        errorToast(err?.response?.data?.Comments);
      });
  }, []);

  if (loading) return  <Riple color="#000000" size="medium" text="" textColor="" />;

  return (
    <AuthenticationContext.Provider value={authenticatedUser}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuth = () => useContext(AuthenticationContext);

export default Authentication;
