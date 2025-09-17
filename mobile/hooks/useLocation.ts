import * as Location from "expo-location";
import { useState } from "react";

export type LocationState = {
  latitude: number;
  longitude: number;
  timestamp?: number;
} | null;

export default function useLocationOnce() {
  const [location, setLocation] = useState<LocationState>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permissão de localização negada.");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timestamp: loc.timestamp ?? Date.now(),
      });
    } catch (e: any) {
      setError(e.message || "Erro ao obter localização");
    } finally {
      setLoading(false);
    }
  };

  return { location, loading, error, getLocation };
}
