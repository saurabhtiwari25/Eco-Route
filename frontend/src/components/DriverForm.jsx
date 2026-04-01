import { useState } from "react";
import api from "../api/axios";

export default function DriverForm({ onCreated }) {
  const [form, setForm] = useState({
    capacity: "",
    lat: "",
    lng: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    await api.post("/drivers", {
      capacity: parseInt(form.capacity),
      start_location: [parseFloat(form.lat), parseFloat(form.lng)]
    });

    onCreated();
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Capacity" onChange={e => setForm({...form, capacity: e.target.value})} />
      <input placeholder="Lat" onChange={e => setForm({...form, lat: e.target.value})} />
      <input placeholder="Lng" onChange={e => setForm({...form, lng: e.target.value})} />
      <button type="submit">Create Driver</button>
    </form>
  );
}