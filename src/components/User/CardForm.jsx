const CardForm = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-8 w-1/3 text-white">
      <h1 className="text-4xl">{title}</h1>
      <div className="bg-yellow-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-2 justify-start">
        {children}
      </div>
    </div>
  );
};

export { CardForm };
