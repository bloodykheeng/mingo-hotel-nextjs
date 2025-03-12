import { useEffect, useState } from "react";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import firebaseApp from "@/firebase";

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("");
  const vapid = process.env.NEXT_PUBLIC_FIREBASE_VAPIDKEY;

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        // if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const hasFirebaseMessagingSupport = await isSupported();
        if (hasFirebaseMessagingSupport) {
          const messaging = getMessaging(firebaseApp);

          // Retrieve the notification permission status
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          // Check if permission is granted before retrieving the token
          if (permission === "granted") {
            // vapid is optional its not a must
            // const currentToken = await getToken(messaging, {
            //   vapidKey:
            //   process.env.NEXT_PUBLIC_FIREBASE_VAPIDKEY,
            // });

            const currentToken = await getToken(messaging);
            console.log("🚀 ~ retrieveToken ~ currentToken:", currentToken);
            if (currentToken) {
              setToken(currentToken);
            } else {
              console.log(
                "No registration token available. Request permission to generate one."
              );
            }
          }
        }
      } catch (error) {
        console.log("An error occurred while retrieving token:", error);
      }
    };

    retrieveToken();
  }, []);

  return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
