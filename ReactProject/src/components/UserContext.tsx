
import { createContext, ReactElement, useState } from "react";
import { Male, Women } from "../Models";

type userContextType = {
  user: Male|Women | null,          // אפשר גם לאפשר null
  setMyUser: (user: Male|Women) => void
}

export const userContext = createContext<userContextType>({
  user: null,
  setMyUser: (_: Male|Women) => {}
});

const UserProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<Male|Women | null>(null);

  const setMyUser = (user: Male|Women) => {
    setUser(user);
  };

  return (
    <userContext.Provider value={{ user: user, setMyUser }}>
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
