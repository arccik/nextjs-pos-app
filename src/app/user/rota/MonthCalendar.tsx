"use client";
import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addDays,
} from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import DayCard from "./DayCard";
import SelectedDay from "./SelectedDay";

import { api } from "@/trpc/react";

export interface RotaItem {
  date: Date;
  name: string;
  shift: string;
}

interface MonthlyRotaProps {
  month: Date;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const COLORS = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-indigo-200",
  "bg-orange-200",
  "bg-teal-200",
  "bg-cyan-200",
];

export const MonthCalendar: React.FC<MonthlyRotaProps> = ({ month }) => {
  const { data: rotaData, refetch: refetchRota } =
    api.rota.getAll.useQuery(month);

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const startDate = addDays(monthStart, -getDay(monthStart));
  const endDate = addDays(monthEnd, 6 - getDay(monthEnd));

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleClick = (day: Date) => {
    setSelectedDay(day);
  };

  return (
    <Card className="flex min-h-full flex-col">
      <SelectedDay
        date={selectedDay}
        diselect={() => setSelectedDay(null)}
        refetchRota={refetchRota}
        rotaData={rotaData}
      />
      <CardContent className="flex flex-grow flex-col p-2">
        {/* Display the days of the week */}
        <div className="hidden md:mb-2 md:mt-2 md:grid md:grid-cols-7 md:gap-1">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="p-2 text-center font-bold">
              {day}
            </div>
          ))}
        </div>
        {/* Display the days in a list on mobile */}
        <div className="grid grid-cols-1 gap-2 md:hidden">
          {days.map((day) => {
            const rotaItem = rotaData?.filter(
              (item) =>
                format(item.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd"),
            );
            const isCurrentMonth = day.getMonth() === month.getMonth();
            return (
              <DayCard
                key={day.toDateString()}
                day={day}
                isCurrentMonth={isCurrentMonth}
                rotaItem={rotaItem}
                onClick={handleClick}
              />
            );
          })}
        </div>
        <div className="hidden md:mt-2 md:grid md:grid-cols-7 md:gap-1">
          {days.map((day) => {
            const rotaItem = rotaData?.filter(
              (item) =>
                format(item.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd"),
            );
            const isCurrentMonth = day.getMonth() === month.getMonth();
            return (
              <DayCard
                key={day.toDateString()}
                day={day}
                isCurrentMonth={isCurrentMonth}
                rotaItem={rotaItem}
                onClick={handleClick}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
