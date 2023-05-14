import { useEffect } from "react";

const NotificationExample = () => {
  useEffect(() => {
    // 檢查瀏覽器是否支援 Web Notification API
    if ("Notification" in window) {
      // 請求用戶授權顯示通知
      Notification.requestPermission();
    }
  }, []);

  const handleClick = () => {
    // 檢查瀏覽器是否支援 Web Notification API
    if ("Notification" in window) {
      // 如果用戶已經授權顯示通知，就發送一個通知
      if (Notification.permission === "granted") {
        new Notification("Hello World!");
      }
    }
  };

  return (
    <div>
      <button onClick={handleClick}>發送通知</button>
    </div>
  );
};

export default NotificationExample;
