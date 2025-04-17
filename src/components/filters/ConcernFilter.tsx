
import { Checkbox } from "@/components/ui/checkbox";

interface ConcernFilterProps {
  concerns: {
    name: string;
    value: string;
    count: number;
  }[];
  selectedConcerns: string[];
  toggleConcern: (concern: string) => void;
}

const ConcernFilter = ({ concerns, selectedConcerns, toggleConcern }: ConcernFilterProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Concerns</h3>
      <div className="space-y-2">
        {concerns.map((concern) => (
          <div key={concern.name} className="flex items-center">
            <Checkbox 
              id={`concern-${concern.value}`}
              checked={selectedConcerns.includes(concern.value)}
              onCheckedChange={() => toggleConcern(concern.value)}
            />
            <label
              htmlFor={`concern-${concern.value}`}
              className="ml-2 text-sm text-gray-700"
            >
              {concern.name} ({concern.count})
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConcernFilter;
