import React from "react";
import { Container, Typography, Box } from "@mui/material";
import LiquidityPoolForm from "./components/LiquidityPoolForm";
import CreateEvent from "./components/CreateEvent";
import PurchaseTicket from "./components/PurchaseTicket";
import ViewTickets from "./components/ViewTickets";

function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stellar Liquidity Pool
        </Typography>
        <LiquidityPoolForm />

        <CreateEvent />
        <PurchaseTicket />
        <ViewTickets />
      </Box>
    </Container>
  );
}
export default App;
