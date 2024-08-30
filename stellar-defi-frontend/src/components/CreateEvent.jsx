import React, { useState } from "react";
import { createEvent } from "../StellarService";

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [organizerSecret, setOrganizerSecret] = useState("");
  const [status, setStatus] = useState(null);

  const handleCreateEvent = async () => {
    const result = await createEvent(eventName, organizerSecret);
    if (result.success) {
      setStatus(
        `Event created! Asset: ${eventName}, Organizer: ${organizerSecret}`
      );
    } else {
      setStatus(`Error: ${result.error.message}`);
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Organizer Secret"
        value={organizerSecret}
        onChange={(e) => setOrganizerSecret(e.target.value)}
      />
      <button onClick={handleCreateEvent}>Create Event</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default CreateEvent;
