# ADR 0001: Put Railway behind a server adapter

Status: accepted

The UI depends on a small `ControlPlaneAdapter`, not Railway response shapes. A deterministic demo implementation and a GraphQL implementation share that interface.

This keeps credentials out of the browser, makes the portfolio demo runnable without an account, and lets workflow tests exercise lifecycle semantics without mocking `fetch`. The trade-off is that demo behavior cannot prove live Railway compatibility; live integration remains a separate verification gate.
