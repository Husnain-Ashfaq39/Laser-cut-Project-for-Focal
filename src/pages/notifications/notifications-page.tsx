import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  writeBatch,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase.config";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import NavbarAdmin from "@/components/nav/navbar-admin";
import FooterAdmin from "@/components/footer/footer-admin";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Define the Notification structure
interface Notification {
  id: string;
  message: string;
  status: string;
  timestamp: Timestamp;
  recipientType: string;
  customerID?: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Get user information from Redux store
  const user = useSelector((state: RootState) => state.auth);
  const userId = user.id;
  const isAdmin = user.role === "admin";
  const isCustomer = user.role === "customer" || !user.role;

  useEffect(() => {
    if (!userId) {
      console.log("User ID is missing");
      return;
    }

    console.log("Setting up notification query:", { isAdmin, isCustomer });

    // Set up the query for notifications based on user role and ID
    const q = query(
      collection(db, "Notifications"),
      where("recipientType", "==", isAdmin ? "admin" : "customer"),
      ...(isCustomer ? [where("customerID", "==", userId)] : []),
      orderBy("timestamp", "desc"),
    );

    // Set up snapshot listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Notification),
      }));
      setNotifications(allNotifications);
    });

    return () => unsubscribe();
  }, [userId, isAdmin, isCustomer]);

  // Clear all notifications
  const clearNotifications = async () => {
    const batch = writeBatch(db);
    notifications.forEach((notification) => {
      const notificationRef = doc(db, "Notifications", notification.id);
      batch.delete(notificationRef);
    });
    await batch.commit();
    setNotifications([]);
  };

  // Delete a specific notification by ID
  const deleteNotification = async (notificationId: string) => {
    const notificationRef = doc(db, "Notifications", notificationId);
    await deleteDoc(notificationRef);

    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== notificationId,
      ),
    );
  };

  return (
    <div className="w-full bg-slate-100">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="font-primary text-3xl">Notifications</h1>
          <button
            onClick={clearNotifications}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Clear Notifications
          </button>
        </div>
        <div className="space-y-3 border-t border-gray-300">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between border-b border-gray-300 py-4"
            >
              <div>
                <p
                  className={`${
                    notification.status === "unread"
                      ? "font-semibold"
                      : "font-normal"
                  }`}
                >
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500">
                  {notification.timestamp
                    ? formatDistanceToNow(notification.timestamp.toDate()) +
                      " ago"
                    : ""}
                </p>
              </div>
              <button
                onClick={() => deleteNotification(notification.id)}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
      <FooterAdmin />
    </div>
  );
};

export default NotificationsPage;
