
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
  const [countryCode, setCountryCode] = useState("+1"); // Default to US
  const [phoneNumber, setPhoneNumber] = useState(value.replace(/^\+\d+\s/, ""));

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
      <div className="w-24 flex-shrink-0">
        <Select value={countryCode} onValueChange={handleCountryCodeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={countryCode} />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {countryCodes.map((country) => (
              <SelectItem key={country.code} value={country.dial_code}>
                {country.dial_code}
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
