"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMins: number;
  price: number;
  currency: string;
}

export default function BookingFlowPage() {
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"date" | "time" | "info" | "confirmed">("date");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/services/${params.serviceId}`)
      .then((r) => r.json())
      .then(setService)
      .catch(() => {});
  }, [params.serviceId]);

  async function fetchSlots(date: string) {
    setSelectedDate(date);
    const res = await fetch(`/api/bookings/slots?serviceId=${params.serviceId}&date=${date}`);
    const data = await res.json();
    setSlots(data.slots || []);
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

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {/* Service info */}
          <div className="mb-6 pb-4 border-b">
            <h1 className="text-lg font-bold text-gray-900">{service.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {service.durationMins} min &middot;{" "}
              {service.price === 0 ? "Free" : formatCurrency(service.price, service.currency)}
            </p>
            {service.description && (
              <p className="text-sm text-gray-500 mt-1">{service.description}</p>
            )}
          </div>

          {step === "date" && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Select a date</h2>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => fetchSlots(e.target.value)}
              />
            </div>
          )}

          {step === "time" && (
            <div>
              <button onClick={() => setStep("date")} className="text-sm text-indigo-600 mb-3 hover:underline">
                &larr; Change date
              </button>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Available times for {format(new Date(selectedDate + "T00:00:00"), "MMMM d, yyyy")}
              </h2>
              {slots.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">No available slots for this date.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStep("info");
                      }}
                      className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                      {format(new Date(slot), "h:mm a")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "info" && (
            <div>
              <button onClick={() => setStep("time")} className="text-sm text-indigo-600 mb-3 hover:underline">
                &larr; Change time
              </button>
              <p className="text-sm text-gray-600 mb-4">
                {format(new Date(selectedSlot), "MMMM d, yyyy 'at' h:mm a")}
              </p>
              <div className="space-y-3">
                <Input
                  label="Your name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
                <Input
                  label="Your email"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button
                  className="w-full"
                  onClick={confirmBooking}
                  loading={loading}
                  disabled={!guestName || !guestEmail}
                >
                  Confirm booking
                </Button>
              </div>
            </div>
          )}

          {step === "confirmed" && (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Booking confirmed!</h2>
              <p className="text-sm text-gray-500">
                {format(new Date(selectedSlot), "MMMM d, yyyy 'at' h:mm a")}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                A confirmation email will be sent to {guestEmail}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
