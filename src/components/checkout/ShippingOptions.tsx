
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/components/LanguageSelector';

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
}

interface ShippingOptionsProps {
  selectedOption: string;
  onSelect: (id: string) => void;
  options: ShippingOption[];
}

const ShippingOptions = ({
  selectedOption,
  onSelect,
  options
}: ShippingOptionsProps) => {
  const { translate } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{translate('shippingMethod')}</h3>
      <RadioGroup value={selectedOption} onValueChange={onSelect} className="gap-4">
        {options.map((option) => (
          <div
            key={option.id}
            className={`flex items-start space-x-3 border p-4 rounded-lg transition-colors ${
              selectedOption === option.id ? 'border-burgundy bg-burgundy/5' : 'border-gray-200'
            }`}
          >
            <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
            <div className="flex-1">
              <div className="flex justify-between">
                <Label
                  htmlFor={option.id}
                  className="font-medium text-base cursor-pointer"
                >
                  {option.name}
                </Label>
                <span className="font-medium">
                  {option.price === 0 
                    ? translate('free') 
                    : `₹${option.price.toLocaleString('ne-NP')}`}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{option.description}</p>
              <p className="text-sm text-burgundy mt-1">{option.estimatedDelivery}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ShippingOptions;
