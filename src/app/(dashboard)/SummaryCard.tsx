import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
// import Loading from "@/components/layout/Loading";
// import Error from "@/components/layout/Error";
import { formatCurrency } from "@/lib/utils";
import {
  paidThisMonth,
  paidThisWeek,
} from "@/server/api/server-action/analytics";

export default async function SummaryCard() {
  const thisWeekTotal = await paidThisWeek();
  const thisMonthTotal = await paidThisMonth();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* {isThisWeekError && <Error message="This week total sales error" />} */}

      <Card x-chunk="dashboard-05-chunk-1">
        <CardHeader className="p-4">
          <CardDescription>This Week</CardDescription>
          <CardTitle className="text-3xl">
            {formatCurrency(thisWeekTotal)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            +25% from last week
          </div>
        </CardContent>
        <CardFooter>
          <Progress value={25} aria-label="25% increase" />
        </CardFooter>
      </Card>
      {/* {isThisMonthError && <Error message="This month total sales error" />} */}
      {thisMonthTotal && (
        <Card x-chunk="dashboard-05-chunk-2">
          <CardHeader className="p-4">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-3xl">
              {formatCurrency(thisMonthTotal)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +10% from last month
            </div>
          </CardContent>
          <CardFooter>
            <Progress value={12} aria-label="12% increase" />
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
