import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { useMemo } from "react";

const AuthContext = ({ children, ...props }) => {
  const { session, sessionKey } = props;
  const memoizedSessionKey = useMemo(() => {
    console.log("session changed >>> ", session);
    return sessionKey;
  }, [session]);
  return (
    <SessionProvider
      session={session}
      basePath="/api/auth"
      refetchOnWindowFocus={false}
      key={memoizedSessionKey}
    >
      {children}
    </SessionProvider>
  );
};

export default AuthContext;
