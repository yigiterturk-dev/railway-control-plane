import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/queryClient";
import ControlPlanePage from "@/pages/control-plane";
import NotFound from "@/pages/not-found";

function AppRouter() { return <Switch><Route path="/" component={ControlPlanePage} /><Route component={NotFound} /></Switch>; }

export default function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><Router hook={useHashLocation}><AppRouter /></Router></TooltipProvider></QueryClientProvider>;
}
