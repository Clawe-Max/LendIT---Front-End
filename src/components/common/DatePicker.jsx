import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const DatePicker = ({ className, name, datesToDisable, onChange, ...rest }) => {
  const inputRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const formattedDatesToDisable = datesToDisable?.map(range => ({
      from: new Date(range.startDate),
      to: new Date(range.deadline)
    })) || [];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const fp = flatpickr(inputRef.current, {
      minDate: tomorrow,
      disable: formattedDatesToDisable,
      dateFormat: "Y-m-d",
      onChange: (selectedDates, dateStr) => {
        if (onChange && dateStr) {
          const dateObject = new Date(`${dateStr}T00:00:00`);
          onChange({
            target: {
              name: name, 
              value: dateObject.toISOString()
            }
          });
        }
      }
    });

    return () => fp.destroy();
  }, [datesToDisable, name, onChange]);

  return(
    <input 
      {...rest}
      ref={inputRef}
      type="date"
      className={cn(
        "w-full p-3focus:ring-2 font-bold text-zinc-100 placeholder-zinc-500 focus:ring-offset-lime-200 placeholder:font-bol bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-yellow-500 ",
        className,
      )}
    />
  );
}

export { DatePicker }