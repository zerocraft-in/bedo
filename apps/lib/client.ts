import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const client = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL,

  timeout: 15000,
});

client.interceptors.request.use(
  async (config) => {

    const raw =
      await AsyncStorage.getItem(
        "@fitness_app_session"
      );

    if (raw) {
      const session =
        JSON.parse(raw);

      config.headers.Authorization =
        `Bearer ${session.accessToken}`;
    }

    return config;
  }
);

export default client;