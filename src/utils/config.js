import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase";

// const app = initializeApp(firebaseConfig);
let messaging;

if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export const getMessagingToken = async () => {
  let currentToken = "";
  if (!messaging) return;
  try {
    currentToken = await getToken(messaging, {
      vapidKey:
        "BDAZlaxdnsEPWTIgTv0VsWYoemnL76zcJZFxD6NiFvOIaJg9D9mEJ7H_OAYeAtA81d9sGlUv3fY0mC-DrJvO9V8",
    });
    console.log("FCM registration token", currentToken);
    localStorage.setItem("FCMToken", currentToken);
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }
  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
