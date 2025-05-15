import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PetEvent, EVENT_TYPE_CONFIG, Pet } from "@shared/schema";
import { AddEventDialog } from "./AddEventDialog";
import { EventDetailsDialog } from "./EventDetailsDialog";
import { CalendarEventCard } from "./CalendarEventCard";

interface PetCalendarProps {
  selectedPet: Pet;
}

export function PetCalendar({ selectedPet }: PetCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PetEvent | null>(null);

  // Fetch events for the current month
  const { data: events = [], isLoading } = useQuery<PetEvent[]>({
    queryKey: [
      "/api/pets/events",
      selectedPet.id,
      format(startOfMonth(currentDate), "yyyy-MM-dd"),
      format(endOfMonth(currentDate), "yyyy-MM-dd"),
    ],
  });

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setAddEventDialogOpen(true);
  };

  const handleEventClick = (event: PetEvent) => {
    setSelectedEvent(event);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, date);
    });
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h3>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={() => setAddEventDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card className="p-4">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-white p-2 text-center text-sm font-semibold"
            >
              {day}
            </div>
          ))}
          {days.map((day, dayIdx) => {
            const dayEvents = getEventsForDate(day);
            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-[100px] bg-white p-2",
                  !isSameMonth(day, currentDate) && "text-gray-400",
                  "hover:bg-gray-50 cursor-pointer"
                )}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex justify-between">
                  <span className={cn(
                    "text-sm",
                    isSameDay(day, new Date()) && "bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center"
                  )}>
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <Badge variant="secondary">
                      {dayEvents.length}
                    </Badge>
                  )}
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.map((event) => (
                    <CalendarEventCard
                      key={event.id}
                      event={event}
                      onClick={() => handleEventClick(event)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add Event Dialog */}
      <AddEventDialog
        open={addEventDialogOpen}
        onOpenChange={setAddEventDialogOpen}
        selectedDate={selectedDate}
        petId={String(selectedPet.id)}
      />

      {/* Event Details Dialog */}
      {selectedEvent && (
        <EventDetailsDialog
          event={selectedEvent}
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
} 