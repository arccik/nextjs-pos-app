import Loading from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/trpc/react";

export function RecentSales() {
  const { data: mostSoldItems, isLoading } =
    api.payment.mostSoldItems.useQuery();
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="space-y-8">
      {mostSoldItems?.map(
        ({ item }) =>
          item && (
            <div key={item.id} className="flex items-center">
              {item.imageUrl && (
                <Avatar className="h-9 w-9">
                  <AvatarImage src={item.imageUrl} alt="Avatar" />
                  <AvatarFallback>{item.name}</AvatarFallback>
                </Avatar>
              )}
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item?.isAvailable && "Is available"}
                </p>
              </div>
              <div className="ml-auto font-medium">£{item.price}</div>
            </div>
          ),
      )}
    </div>
  );
}
