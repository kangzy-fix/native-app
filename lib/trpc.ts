import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  throw new Error(
    "No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL"
  );
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      async headers() {
        const token = await AsyncStorage.getItem('authToken');
        return {
          'Content-Type': 'application/json',
          'authorization': token ? `Bearer ${token}` : '',
        };
      },
      fetch(url, options) {
        console.log('[tRPC Request]', url, options?.method);
        return fetch(url, {
          ...options,
          credentials: 'include',
        }).then(async (response) => {
          console.log('[tRPC Response]', response.status, response.statusText);
          if (!response.ok) {
            const text = await response.text();
            console.error('[tRPC Error Response]', text);
            throw new Error(`HTTP ${response.status}: ${text}`);
          }
          return response;
        });
      },
    }),
  ],
});
