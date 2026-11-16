import { useEffect, useState } from 'react';

interface QuantityInputProps {
  value: number;
  label: string;
  onChange: (quantity: number) => void;
  className?: string;
}

export default function QuantityInput({ value, label, onChange, className = '' }: QuantityInputProps) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commitQuantity = () => {
    const quantity = Number(draft);
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      setDraft(String(value));
      return;
    }

    setDraft(String(quantity));
    onChange(quantity);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      aria-label={label}
      value={draft}
      onChange={(event) => {
        if (/^\d*$/.test(event.target.value)) setDraft(event.target.value);
      }}
      onBlur={commitQuantity}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur();
      }}
      className={`w-14 bg-white px-1 text-center text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}
