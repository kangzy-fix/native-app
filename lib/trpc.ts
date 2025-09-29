import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import superjson from "superjson";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a mock AppRouter type for now
type AppRouter = any;

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // For development, use a mock API or local server
  return "http://localhost:3000";
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      async headers() {
        try {
          const token = await AsyncStorage.getItem('authToken');
          return {
            'Content-Type': 'application/json',
            'authorization': token ? `Bearer ${token}` : '',
          };
        } catch (error) {
          console.warn('Error getting auth token:', error);
          return {
            'Content-Type': 'application/json',
          };
        }
      },
      fetch(url, options) {
        // Mock fetch for development
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: () => Promise.resolve({ result: { data: null } }),
          text: () => Promise.resolve('{"result":{"data":null}}'),
        };
      },
    }),
  ],