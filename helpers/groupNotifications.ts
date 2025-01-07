import { isToday, isYesterday, subDays } from "date-fns";
import { AppNotification } from "replyke-rn";

export function groupNotifications(
  notifications: AppNotification.UnifiedAppNotification[]
) {
  const today: AppNotification.UnifiedAppNotification[] = [];
  const yesterday: AppNotification.UnifiedAppNotification[] = [];
  const last30Days: AppNotification.UnifiedAppNotification[] = [];
  const older: AppNotification.UnifiedAppNotification[] = [];

  notifications.forEach((notification) => {
    if (isToday(new Date(notification.createdAt))) {
      today.push(notification);
    } else if (isYesterday(new Date(notification.createdAt))) {
      yesterday.push(notification);
    } else if (new Date(notification.createdAt) > subDays(new Date(), 30)) {
      last30Days.push(notification);
    } else {
      older.push(notification);
    }
  });

  const sections = [
    { title: "Today", data: today },
    { title: "Yesterday", data: yesterday },
    { title: "Last 30 days", data: last30Days },
    { title: "Older", data: older },
  ].filter((section) => section.data.length > 0);

  return sections;
}
