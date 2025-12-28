// NotificationContext.jsx
import { createContext, useState } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifyCount, setNotifyCount] = useState(0);

  return (
    <NotificationContext.Provider
      value={{ notifyCount, setNotifyCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
