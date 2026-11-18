"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export const AVAILABLE_CITIES = [
  "Delhi NCR",
  "Ahmedabad",
  "Mumbai",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Kolkata",
  "Chennai",
];

interface LocationContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  availableCities: string[];
}

const LocationContext = createContext<LocationContextType>({
  selectedCity: "Delhi NCR",
  setSelectedCity: () => {},
  availableCities: AVAILABLE_CITIES,
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<string>("Delhi NCR");

  useEffect(() => {
    const saved = localStorage.getItem("urban_air_city");
    if (saved && AVAILABLE_CITIES.includes(saved)) {
      setSelectedCityState(saved);
    }
  }, []);

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    localStorage.setItem("urban_air_city", city);
  };

  return (
    <LocationContext.Provider value={{ selectedCity, setSelectedCity, availableCities: AVAILABLE_CITIES }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
