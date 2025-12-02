import React, { createContext, useContext, useState } from "react";
import AlertCard from "./alertcard";
 // <-- Make sure this exists

const AlertContext = createContext();

export const useGlobalAlert = () => useContext(AlertContext);

export const GlobalAlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    title: "",
    message: "",
    image: null,
  });

  const showAlert = (type, title, message) => {
    setAlert({
      visible: true,
      type,
      title,
      message,
      image:
        type === "success"
          ? require("../assets/images/success.jpg")
          : require("../assets/images/fail.jpg"),
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}

      <AlertCard
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        image={alert.image}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
};
