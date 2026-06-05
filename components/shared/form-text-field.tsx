const INPUT_CLASS =
  "mt-1 w-full rounded-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-(--color-text)";

/** Standard labeled text input used across all form modals. */
export function FormTextField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
  minLength,
}: {
  label: string;
  name?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  minLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-(--color-text)">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        className={INPUT_CLASS}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

/** Standard labeled select input. */
export function FormSelectField({
  label,
  value,
  onChange,
  required,
  placeholder,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-(--color-text)">{label}</label>
      <select
        required={required}
        className={INPUT_CLASS}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    </div>
  );
}

/** Accessible toggle switch (used for is_active in location form). */
export function ToggleSwitch({
  label,
  checked,
  onChange,
  activeLabel = "Aktif",
  inactiveLabel = "Nonaktif",
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-(--color-text)">{label}</label>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${checked ? "bg-bomba-500" : "bg-(--color-surface-offset)"}`}
      >
        <span
          className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
      <span className="ml-2 text-xs text-(--color-text-muted)">{checked ? activeLabel : inactiveLabel}</span>
    </div>
  );
}
