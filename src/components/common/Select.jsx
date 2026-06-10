import { cn } from "../../lib/utils";

const Select = ({ className, options, ...rest }) => {
  const optionsList = Object.entries(options);

  return (
    <select 
      {...rest}
      className={cn(
        "w-full p-3focus:ring-2 font-bold text-zinc-100 placeholder-zinc-500 focus:ring-offset-lime-200 placeholder:font-bol bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-yellow-500 ",
        className
      )}
    >
      {optionsList.map(([key, value]) => (
        <option key={key} value={value}>{key}</option>
      ))}
    </select>
  );
}

export { Select };