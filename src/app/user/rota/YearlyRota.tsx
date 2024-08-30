"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { MonthCalendar } from "./MonthCalendar";

interface YearlyRotaProps {
  today: Date;
}

export const YearlyRota: React.FC<YearlyRotaProps> = ({ today }) => {
  const [currentMonth, setCurrentMonth] = useState(today);

  const handlePrevMonth = () =>
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  const handleNextMonth = () =>
    setCurrentMonth((nextMonth) => addMonths(nextMonth, 1));

  return (
    <div className="flex h-screen flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <CardTitle className="text-center text-2xl">
          {format(currentMonth, "MMMM yyyy")}
        </CardTitle>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <MonthCalendar
          month={currentMonth}
          // rotaData={rotaData.filter(
          //   (item) =>
          //     new Date(item.date).getFullYear() ===
          //       currentMonth.getFullYear() &&
          //     new Date(item.date).getMonth() === currentMonth.getMonth(),
          // )}
        />
      </CardContent>
    </div>
  );
};
