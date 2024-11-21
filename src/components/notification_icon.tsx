import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import {
  collection,
  onSnapshot,
  query,
  where,
  writeBatch,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase.config";
import notificationSound from "@/assets/notification.mp3";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Notification {
  id: string;
  message: string;
  status: string;
  timestamp: Timestamp;
  recipientType: string;
  customerID?: string;
}

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth);
  const userId = user.id;
  const isAdmin = user.role === "admin";
  const isCustomer = user.role === "customer" || !user.role;

  const handleSeeAllClick = () => {
    navigate("/notifications");
  };

  // Mark notifications as seen
  const markNotificationsAsSeen = async () => {
    const batch = writeBatch(db);
    notifications
      .filter((n) => n.status === "unread")
      .forEach((n) => {
        const notificationRef = doc(db, "Notifications", n.id);
        batch.update(notificationRef, { status: "read" });
      });
    await batch.commit();
    setUnreadCount(0);
  };

  // Handle outside clicks to close the dropdown and mark notifications as seen
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isDropdownOpen) {
          markNotificationsAsSeen();
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isDropdownOpen, notifications]);

  useEffect(() => {
    if (!userId) {
      console.log("User ID is missing, current user state:", user);
      return;
    }

    const q = query(
      collection(db, "Notifications"),
      where("recipientType", "==", isAdmin ? "admin" : "customer"),
      ...(isCustomer ? [where("customerID", "==", userId)] : []),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Notification),
        }));

        setNotifications(allNotifications);

        const newUnreadCount = allNotifications.filter(
          (n) => n.status === "unread"
        ).length;

        const newNotifications = allNotifications.filter(
          (n) => n.status === "unread"
        );

        const playedNotifications = new Set();

        newNotifications.forEach((notification) => {
          if (!playedNotifications.has(notification.id)) {
            const audio = new Audio(notificationSound);
            audio.play();
            playedNotifications.add(notification.id);
          }
        });

        setUnreadCount(newUnreadCount);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
      }
    );

    return () => unsubscribe();
  }, [userId, isAdmin, isCustomer]);

  const toggleDropdown = () => {
    if (isDropdownOpen) markNotificationsAsSeen();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Bell size={24} className="cursor-pointer" onClick={toggleDropdown} />
      {unreadCount > 0 && (
        <span className="absolute right-0 top-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {unreadCount}
        </span>
      )}

      {isDropdownOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 space-y-2 rounded-lg bg-white p-3 shadow-lg">
          {notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`flex flex-col rounded-lg p-3 ${
                notification.status === "unread"
                  ? "bg-gray-100 font-semibold"
                  : "bg-white"
              } border border-gray-200 shadow-sm`}
            >
              <p>{notification.message}</p>
              <p className="text-xs text-gray-500">
                {notification.timestamp
                  ? formatDistanceToNow(notification.timestamp.toDate()) + " ago"
                  : ""}
              </p>
            </div>
          ))}
          <button
            className="mt-2 w-full py-2 font-medium text-blue-500 hover:text-blue-700"
            onClick={handleSeeAllClick}
          >
            See All
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
