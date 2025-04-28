interface SliderInputProps {
  name: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SliderInput({
  name,
  label,
  min,
  max,
  step = 1,
  value,
  onChange
}: SliderInputProps) {
  return (
    // <div className="mb-4">
    //   <label className="flex items-center justify-between">
    //     <span>{label}:</span>
    //     <input 
    //       type="range" 
    //       name={name} 
    //       min={min} 
    //       max={max} 
    //       step={step} 
    //       value={value} 
    //       onChange={onChange} 
    //       className="w-3/5 mx-3"
    //     />
    //     <span className="w-12 text-right">{value}</span>
    //   </label>
    // </div>
    <div className="mb-4">
      <label className="flex items-center">
        <span 
          className="w-1/3 min-w-[180px] font-semibold text-gray-700"
        >
          {label}:
        </span>
        <input 
          type="range" 
          name={name} 
          min={min} 
          max={max} 
          step={step} 
          value={value} 
          onChange={onChange} 
          className="flex-1 mx-3"
        />
        <span className="w-12 text-center font-bold border border-gray-400 rounded-md py-1">{value}</span>
      </label>
    </div>
  )
}

export default SliderInput;