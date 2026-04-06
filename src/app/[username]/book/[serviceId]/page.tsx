"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  startOfToday,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMins: number;
  price: number;
  currency: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BookingFlowPage() {
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"date" | "time" | "info" | "confirmed">("date");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = startOfToday();

  useEffect(() => {
    fetch(`/api/services/${params.serviceId}`)
      .then((r) => r.json())
      .then(setService)
      .catch(() => {});
  }, [params.serviceId]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startPadding = getDay(monthStart);
    return { days, startPadding };
  }, [currentMonth]);

  async function handleDateSelect(day: Date) {
    setSelectedDate(day);
    setSlotsLoading(true);
    const dateStr = format(day, "yyyy-MM-dd");
    try {
      const res = await fetch(
        `/api/bookings/slots?serviceId=${params.serviceId}&date=${dateStr}`
      );
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    }
    setSlotsLoading(false);
    setStep("time");
  }

  async function confirmBooking() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: params.serviceId,
        guestName,
        guestEmail,
        startTime: selectedSlot,
        notes: notes || undefined,
      }),
    });
    if (res.ok) {
      setStep("confirmed");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to book. Please try again.");
    }
    setLoading(false);
  }

  // --- Loading state ---
  if (!service) {
    return (
      <div className="min-h-screen bg-[#08080c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-500">Loading booking...</p>
        </div>
      </div>
    );
  }

  // --- Step indicator ---
  const steps = [
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: "info", label: "Details" },
    { key: "confirmed", label: "Done" },
  ];
  const currentStepIdx = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-[#08080c] flex items-center justify-center p-4">
      {/* Subtle background radial glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Main card */}
        <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Gradient top accent bar */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

          {/* Service header */}
          <div className="px-6 pt-6 pb-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-white truncate">{service.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {service.durationMins} min
                  </span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-xs font-medium text-indigo-400">
                    {service.price === 0 ? "Free" : formatCurrency(service.price, service.currency)}
                  </span>
                </div>
                {service.description && (
                  <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2">{service.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Step progress */}
          <div className="px-6 pb-5">
            <div className="flex items-center gap-1">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center flex-1">
                  <div className="flex items-center gap-1.5 flex-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                        i < currentStepIdx
                          ? "bg-indigo-500 text-white"
                          : i === currentStepIdx
                          ? "bg-indigo-500/20 text-indigo-400 ring-2 ring-indigo-500/50"
                          : "bg-zinc-800 text-zinc-600"
                      }`}
                    >
                      {i < currentStepIdx ? (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-medium hidden sm:block ${
                        i <= currentStepIdx ? "text-zinc-300" : "text-zinc-600"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-px flex-1 mx-1 transition-colors duration-300 ${
                        i < currentStepIdx ? "bg-indigo-500/50" : "bg-zinc-800"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-zinc-800" />

          {/* Content area */}
          <div className="px-6 py-6">
            {/* STEP: DATE */}
            {step === "date" && (
              <div>
                <h2 className="text-sm font-medium text-zinc-300 mb-4">Select a date</h2>

                {/* Calendar navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    disabled={isBefore(endOfMonth(subMonths(currentMonth, 1)), today)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-sm font-semibold text-white">
                    {format(currentMonth, "MMMM yyyy")}
                  </h3>
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-1">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="text-center text-[10px] font-medium text-zinc-500 py-1.5">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for padding */}
                  {Array.from({ length: calendarDays.startPadding }).map((_, i) => (
                    <div key={`pad-${i}`} />
                  ))}

                  {calendarDays.days.map((day) => {
                    const isPast = isBefore(day, today);
                    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                    const isToday = isSameDay(day, today);

                    return (
                      <button
                        key={day.toISOString()}
                        disabled={isPast}
                        onClick={() => handleDateSelect(day)}
                        className={`
                          relative h-10 rounded-lg text-sm font-medium transition-all duration-150
                          focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-1 focus:ring-offset-zinc-900
                          ${
                            isPast
                              ? "text-zinc-700 cursor-not-allowed"
                              : isSelected
                              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                              : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                          }
                        `}
                      >
                        {format(day, "d")}
                        {isToday && !isSelected && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP: TIME */}
            {step === "time" && (
              <div>
                <button
                  onClick={() => setStep("date")}
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-4"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Change date
                </button>

                <h2 className="text-sm font-medium text-zinc-300 mb-1">Pick a time</h2>
                <p className="text-xs text-zinc-500 mb-5">
                  {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>

                {slotsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-zinc-500">No available times for this date.</p>
                    <button
                      onClick={() => setStep("date")}
                      className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Try another date
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setStep("info");
                        }}
                        className="px-3 py-2.5 text-sm font-medium rounded-full border border-zinc-700 text-zinc-300 hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        {format(new Date(slot), "h:mm a")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP: INFO */}
            {step === "info" && (
              <div>
                <button
                  onClick={() => setStep("time")}
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-4"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Change time
                </button>

                {/* Selected date/time summary */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {format(new Date(selectedSlot), "EEEE, MMMM d")}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {format(new Date(selectedSlot), "h:mm a")} - {service.durationMins} min
                    </p>
                  </div>
                </div>

                <h2 className="text-sm font-medium text-zinc-300 mb-4">Your details</h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Name</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3.5 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-3.5 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      Notes <span className="text-zinc-600">(optional)</span>
                    </label>
                    <textarea
                      className="w-full px-3.5 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                      rows={2}
                      placeholder="Anything you'd like us to know..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={confirmBooking}
                    disabled={!guestName || !guestEmail || loading}
                    className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}

            {/* STEP: CONFIRMED */}
            {step === "confirmed" && (
              <div className="text-center py-6">
                {/* Animated checkmark */}
                <div className="relative w-16 h-16 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" style={{ animationDuration: "1.5s", animationIterationCount: "1" }} />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      style={{
                        strokeDasharray: 30,
                        strokeDashoffset: 30,
                        animation: "checkmark-draw 0.5s ease-out 0.3s forwards",
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h2>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 mb-4">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span className="text-sm text-zinc-300">
                    {format(new Date(selectedSlot), "EEEE, MMMM d 'at' h:mm a")}
                  </span>
                </div>

                <p className="text-sm text-zinc-500 mt-2">
                  A confirmation email has been sent to{" "}
                  <span className="text-zinc-400">{guestEmail}</span>.
                </p>

                {/* Inline keyframe style for the checkmark animation */}
                <style>{`
                  @keyframes checkmark-draw {
                    to { stroke-dashoffset: 0; }
                  }
                `}</style>
              </div>
            )}
          </div>

          {/* Footer branding */}
          <div className="px-6 py-3 border-t border-zinc-800/50">
            <p className="text-[10px] text-zinc-600 text-center">
              Powered by <span className="text-zinc-500 font-medium">PageDrop</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
