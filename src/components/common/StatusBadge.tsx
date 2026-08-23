import React from "react";
import { RentalOrderStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import {
  Clock,
  CheckCircle2,
  CreditCard,
  PackageCheck,
  RotateCcw,
  XCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: RentalOrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "PLACED":
      return (
        <Badge variant="warning" className="gap-1.5 py-1">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Placed (Pending Confirmation)</span>
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge variant="info" className="gap-1.5 py-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
          <span>Confirmed (Pay Now)</span>
        </Badge>
      );
    case "PAID":
      return (
        <Badge variant="purple" className="gap-1.5 py-1">
          <CreditCard className="w-3.5 h-3.5 text-purple-600" />
          <span>Paid (Awaiting Pickup)</span>
        </Badge>
      );
    case "PICKED_UP":
      return (
        <Badge variant="success" className="gap-1.5 py-1">
          <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Picked Up (In Use)</span>
        </Badge>
      );
    case "RETURNED":
      return (
        <Badge variant="default" className="gap-1.5 py-1">
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Returned (Completed)</span>
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="danger" className="gap-1.5 py-1">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Cancelled</span>
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}
