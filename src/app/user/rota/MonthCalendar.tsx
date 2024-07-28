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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Rota } from "@/server/db/schemas";

export interface RotaItem {
  date: Date;
  name: string;
  shift: string;
}

interface MonthlyRotaProps {
  month: Date;
  rotaData: Rota[];
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

export const MonthCalendar: React.FC<MonthlyRotaProps> = ({
  month,
  rotaData,
}) => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const startDate = addDays(monthStart, -getDay(monthStart));
  const endDate = addDays(monthEnd, 6 - getDay(monthEnd));

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleClick = (day: Date) => {
    console.log("DaY CLicKED >>>!!!", day);
    setSelectedDay(day);
  };

  return (
    <Card className="flex h-full w-full flex-col">
      {/* <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>
              Here you can add new items to the menu
              <p>{selectedDay?.toDateString()}/</p>
            </DialogDescription>
          </DialogHeader>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
            repellendus eligendi recusandae laborum ratione nesciunt laboriosam
            maiores! Assumenda, voluptatum officiis.
          </p>
        </DialogContent>
      </Dialog> */}
      <SelectedDay date={selectedDay} diselect={() => setSelectedDay(null)} />
      <CardContent className="bg-gradient-radial grid flex-grow grid-cols-7 grid-rows-[auto_1fr_1fr_1fr_1fr_1fr_1fr] gap-1">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="p-2 text-center font-bold">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const rotaItem = rotaData.filter(
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
      </CardContent>
    </Card>
  );
};
