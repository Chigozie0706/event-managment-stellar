import React, { useState } from "react";
import { createEvent } from "../StellarService";
import { Keypair } from "@stellar/stellar-sdk";

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [organizerSecret, setOrganizerSecret] = useState("");
  const [status, setStatus] = useState(null);

  const fundAccountWithFriendbot = async (publicKey) => {
    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${publicKey}`
      );
      if (response.ok) {
        setStatus("Account funded successfully!");
      } else {
        throw new Error("Failed to fund account");
      }
    } catch (error) {
      setStatus(`Error funding account: ${error.message}`);
    }
  };

  const handleCreateEvent = async () => {
    try {
      // Generate the organizer's keypair from the secret
      const organizerKeypair = Keypair.fromSecret(organizerSecret);
      const publicKey = organizerKeypair.publicKey();

      // Fund the organizer's account using Friendbot
      await fundAccountWithFriendbot(publicKey);

      // Create the event
      const result = await createEvent(eventName, organizerSecret);
      if (result.success) {
        setStatus(
          `Event created! Event Name: ${eventName}, Organizer Public Key: ${publicKey}`
        );
        console.log(result);
      } else {
        setStatus(`Error: ${result.error.message}`);
        console.log(error);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      console.log(error);
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
