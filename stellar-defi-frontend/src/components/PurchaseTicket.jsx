import React, { useState } from "react";
import { purchaseTicket } from "../StellarService";

const PurchaseTicket = () => {
  const [eventName, setEventName] = useState("");
  const [eventIssuer, setEventIssuer] = useState("");
  const [participantSecret, setParticipantSecret] = useState("");
  const [ticketPrice, setTicketPrice] = useState("1");
  const [status, setStatus] = useState(null);

  const handlePurchaseTicket = async () => {
    const eventAsset = new Asset(eventName, eventIssuer);
    const result = await purchaseTicket(
      eventAsset,
      participantSecret,
      ticketPrice
    );
    if (result.success) {
      setStatus("Ticket purchased successfully!");
    } else {
      setStatus(`Error: ${result.error.message}`);
    }
  };

  return (
    <div>
      <h2>Purchase Ticket</h2>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Event Issuer Public Key"
        value={eventIssuer}
        onChange={(e) => setEventIssuer(e.target.value)}
      />
      <input
        type="text"
        placeholder="Participant Secret"
        value={participantSecret}
        onChange={(e) => setParticipantSecret(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ticket Price"
        value={ticketPrice}
        onChange={(e) => setTicketPrice(e.target.value)}
      />
      <button onClick={handlePurchaseTicket}>Purchase Ticket</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default PurchaseTicket;
