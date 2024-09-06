import { api } from "@/trpc/server";
import AlertMessage from "./AlertMessage";
import { getServerAuthSession } from "@/server/auth";

export default async function AlertMessages() {
  const session = await getServerAuthSession();
  if (!session) return null;
  const notifications = await api.notification.getUnread();

  if (notifications?.length === 0) return null;

  return (
    <div className="p-2">
      <div className="flex flex-col gap-3">
        {notifications?.map((notification) => (
          <AlertMessage key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
