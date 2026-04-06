"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMins: number;
  price: number;
  currency: string;
  isActive: boolean;
}

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  startTime: string;
  endTime: string;
  status: string;
  service: { name: string; durationMins: number; price: number };
}

interface AvailabilitySlot {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  bufferMins: number;
  timezone?: string;
  isActive?: boolean;
}

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DEFAULT_AVAILABILITY: AvailabilitySlot[] = Array.from({ length: 7 }, (_, i) => ({
  dayOfWeek: i,
  startTime: "09:00",
  endTime: "17:00",
  bufferMins: 15,
}));

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    durationMins: 60,
    price: 0,
  });
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(DEFAULT_AVAILABILITY);
  const [enabledDays, setEnabledDays] = useState<Set<number>>(new Set([1, 2, 3, 4, 5]));
  const [savingAvailability, setSavingAvailability] = useState(false);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices);
    fetch("/api/bookings").then((r) => r.json()).then(setBookings);
    fetch("/api/availability")
      .then((r) => r.json())
      .then((slots: AvailabilitySlot[]) => {
        if (slots && slots.length > 0) {
          const activeDays = new Set(slots.filter((s) => s.isActive !== false).map((s) => s.dayOfWeek));
          setEnabledDays(activeDays);
          const merged = DEFAULT_AVAILABILITY.map((def) => {
            const existing = slots.find((s) => s.dayOfWeek === def.dayOfWeek);
            return existing
              ? { ...def, startTime: existing.startTime, endTime: existing.endTime, bufferMins: existing.bufferMins ?? 15 }
              : def;
          });
          setAvailability(merged);
        }
      })
      .catch(() => {});
  }, []);

  async function addService() {
    setSaving(true);
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newService),
    });
    if (res.ok) {
      const service = await res.json();
      setServices([service, ...services]);
      setNewService({ name: "", description: "", durationMins: 60, price: 0 });
      setShowAddService(false);
      toast.success("Service created");
    }
    setSaving(false);
  }

  async function cancelBooking(id: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b)));
    toast.success("Booking cancelled");
  }

  function toggleDay(day: number) {
    setEnabledDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  function updateSlot(day: number, field: "startTime" | "endTime" | "bufferMins", value: string | number) {
    setAvailability((prev) =>
      prev.map((s) => (s.dayOfWeek === day ? { ...s, [field]: value } : s))
    );
  }

  async function saveAvailability() {
    setSavingAvailability(true);
    try {
      const slots = availability
        .filter((s) => enabledDays.has(s.dayOfWeek))
        .map(({ dayOfWeek, startTime, endTime, bufferMins }) => ({
          dayOfWeek,
          startTime,
          endTime,
          bufferMins,
        }));
      const res = await fetch("/api/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots }),
      });
      if (res.ok) {
        toast.success("Availability saved");
      } else {
        toast.error("Failed to save availability");
      }
    } catch {
      toast.error("Failed to save availability");
    }
    setSavingAvailability(false);
  }

  const upcomingBookings = bookings.filter(
    (b) => b.status !== "CANCELLED" && new Date(b.startTime) > new Date()
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Booking</h2>
        <p className="text-sm text-gray-500">Manage your services and view bookings.</p>
      </div>

      {/* Services */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Services</h3>
          <Button size="sm" onClick={() => setShowAddService(true)}>
            Add service
          </Button>
        </div>

        {showAddService && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
            <Input
              label="Service name"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              placeholder="e.g. 60-min Coaching Call"
            />
            <Input
              label="Description (optional)"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            />
            <div className="flex gap-3">
              <Input
                label="Duration (mins)"
                type="number"
                value={newService.durationMins}
                onChange={(e) => setNewService({ ...newService, durationMins: parseInt(e.target.value) || 60 })}
              />
              <Input
                label="Price (cents, 0=free)"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={addService} loading={saving}>Create</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAddService(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {services.length === 0 && !showAddService ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Create a service so visitors can book you
          </p>
        ) : (
          <div className="space-y-2">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{service.name}</p>
                  <p className="text-xs text-gray-500">
                    {service.durationMins} min &middot;{" "}
                    {service.price === 0 ? "Free" : formatCurrency(service.price, service.currency)}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${service.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Availability</h3>
            <p className="text-xs text-gray-500 mt-0.5">Set your working hours for each day of the week</p>
          </div>
          <Button size="sm" onClick={saveAvailability} loading={savingAvailability}>
            Save availability
          </Button>
        </div>

        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 0].map((day) => {
            const slot = availability.find((s) => s.dayOfWeek === day)!;
            const enabled = enabledDays.has(day);
            return (
              <div
                key={day}
                className={`flex items-center gap-3 p-3 rounded-lg ${enabled ? "bg-gray-50" : "bg-gray-50/50"}`}
              >
                <button
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    enabled ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      enabled ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>

                <span className={`w-24 text-sm font-medium ${enabled ? "text-gray-900" : "text-gray-400"}`}>
                  {DAY_LABELS[day]}
                </span>

                {enabled ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateSlot(day, "startTime", e.target.value)}
                      className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-gray-400">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateSlot(day, "endTime", e.target.value)}
                      className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex items-center gap-1 ml-auto">
                      <input
                        type="number"
                        min={0}
                        max={120}
                        value={slot.bufferMins}
                        onChange={(e) => updateSlot(day, "bufferMins", parseInt(e.target.value) || 0)}
                        className="w-16 text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-gray-400 whitespace-nowrap">min buffer</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Unavailable</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming bookings */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming bookings</h3>
        {upcomingBookings.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No upcoming bookings</p>
        ) : (
          <div className="space-y-2">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{booking.guestName}</p>
                  <p className="text-xs text-gray-500">
                    {booking.service.name} &middot;{" "}
                    {format(new Date(booking.startTime), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  <p className="text-xs text-gray-400">{booking.guestEmail}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => cancelBooking(booking.id)}>
                  Cancel
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
