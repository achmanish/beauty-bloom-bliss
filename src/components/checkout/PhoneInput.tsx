import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryCodes } from '@/data/countryCodes';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const PhoneInput = ({ value, onChange, required = false }: PhoneInputProps) => {
  const [countryCode, setCountryCode] = useState("+977"); // Default to Nepal
  const [phoneNumber, setPhoneNumber] = useState(value.replace(/^\+\d+\s/, ""));

  // Sort country codes alphabetically but keep Nepal at top
  const sortedCountryCodes = [...countryCodes].sort((a, b) => {
    if (a.code === "NP") return -1; // Nepal first
    if (b.code === "NP") return 1;
    return a.name.localeCompare(b.name); // Alphabetical for the rest
  });

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode);
    const fullNumber = `${newCode} ${phoneNumber}`;
    onChange(fullNumber);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers, spaces, and dashes
    const newPhone = e.target.value.replace(/[^\d\s-]/g, "");
    setPhoneNumber(newPhone);
    const fullNumber = `${countryCode} ${newPhone}`;
    onChange(fullNumber);
  };

  return (
    <div className="flex gap-2">
      <div className="w-28 flex-shrink-0">
        <Select value={countryCode} onValueChange={handleCountryCodeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={countryCode} />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {sortedCountryCodes.map((country) => (
              <SelectItem key={country.code} value={country.dial_code}>
                <div className="flex items-center gap-2">
                  <span>{country.dial_code}</span>
                  <span className="text-gray-500 text-xs">({country.name})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <input
        type="tel"
        className="w-full p-2 border rounded-md"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder="Phone number"
        required={required}
      />
    </div>
  );
};

export default PhoneInput;
