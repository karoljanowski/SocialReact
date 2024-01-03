import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../helpers/supabaseCilent";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const login = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });

const signOut = () => supabase.auth.signOut();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const { user: currentUser } = data;
      setUser(currentUser ?? null);
      setAuth(currentUser ? true : false);
      setLoading(false);
    };
    getUser();
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session.user);
        setAuth(true);
      } else if (event === "SIGNED_OUT") {
        setAuth(false);
        setUser(null);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    async function fetchInfo() {
      const {data: profile, error} = await supabase
      .from('profile')
      .select()
      .eq('id', user.id)
      if(!error){
        setUserInfo(profile)
      }
    }
    if(user){
      fetchInfo()
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        auth,
        user,
        userInfo,
        login,
        signOut
      }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;