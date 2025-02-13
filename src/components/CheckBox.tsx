type CheckboxProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  type : "checkbox" 
};

export default function CheckBox(props : CheckboxProps) {
  const {children, className, ... rest} = props;
  return (
    <div className="flex items-center gap-2">
      <input
        id="chk"
        className="w-5 h-5 appearance-none border border-[#4f4f4f]
         bg-white checked:bg-[#4f4f4f] rounded-[4px]
          checked:bg-[url('./check-icon.svg')] checked:bg-no-repeat checked:bg-center"
          {...rest}
      />
      <label htmlFor="chk">
        {children}
      </label>
    </div>
  );
}