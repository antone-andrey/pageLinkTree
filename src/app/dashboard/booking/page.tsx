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

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices);
    fetch("/api/bookings").then((r) => r.json()).then(setBookings);
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
