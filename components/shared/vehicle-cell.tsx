import { Bike, Car } from "lucide-react";

/** Pill displaying a vehicle type with an icon. */
export function VehicleCell({ vehicleType }: { vehicleType: string }) {
  const isMotor = vehicleType === "Motor";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-(--color-border) bg-(--color-surface-2) px-2.5 py-1 text-xs font-medium ${
        isMotor ? "text-teluk-800" : "text-bomba-800"
      }`}
    >
      {isMotor ? (
        <Bike className="size-3.5 text-teluk-600" strokeWidth={1.75} aria-hidden />
      ) : (
        <Car className="size-3.5 text-bomba-600" strokeWidth={1.75} aria-hidden />
      )}
      {vehicleType}
    </span>
  );
}
