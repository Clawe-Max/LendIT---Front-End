const Input = ({ className, ...rest }) => {
  return (
    <input
      {...rest}
      className={`w-full p-3 outline-none focus:ring-2  ${
        className ||
        "bg-amber-50 placeholder-zinc-500 focus:ring-offset-lime-200 rounded-xl placeholder:font-bold"
      }`}
    />
  );
};

export { Input };
