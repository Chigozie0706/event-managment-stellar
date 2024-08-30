import React, { useState } from "react";
import { viewTickets } from "../StellarService";

const ViewTickets = () => {
  const [publicKey, setPublicKey] = useState("");
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState(null);

  const handleViewTickets = async () => {
    const result = await viewTickets(publicKey);
    if (result.success) {
      setTickets(result.balances);
      setStatus(null);
    } else {
      setStatus(`Error: ${result.error.message}`);
    }
  };

  return (
    <div>
      <h2>View Tickets</h2>
      <input
        type="text"
        placeholder="Your Public Key"
        value={publicKey}
        onChange={(e) => setPublicKey(e.target.value)}
      />
      <button onClick={handleViewTickets}>View Tickets</button>
      {status && <p>{status}</p>}
      <ul>
        {tickets.map((ticket, index) => (
          <li key={index}>
            {ticket.asset_code} - Amount: {ticket.balance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewTickets;
