import { useState } from "react";
import api from "../api/axios";

export default function OrderForm({ onCreated }) {
  const [form, setForm] = useState({
    lat: "",
    lng: "",
    priority: "",
    start: "",
    end: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    await api.post("/orders", {
      location: [parseFloat(form.lat), parseFloat(form.lng)],
      priority: parseInt(form.priority),
      time_window: [parseInt(form.start), parseInt(form.end)]
    });

    onCreated();
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Lat" onChange={e => setForm({...form, lat: e.target.value})} />
      <input placeholder="Lng" onChange={e => setForm({...form, lng: e.target.value})} />
      <input placeholder="Priority" onChange={e => setForm({...form, priority: e.target.value})} />
      <input placeholder="Start Time" onChange={e => setForm({...form, start: e.target.value})} />
      <input placeholder="End Time" onChange={e => setForm({...form, end: e.target.value})} />
      <button type="submit">Create Order</button>
    </form>
  );
}