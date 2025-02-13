type InputProps = React.ComponentPropsWithoutRef<"input">;

export default function GlobalInput(props :InputProps) {
  const {...rest} = props;
  return (
    <div className="w-full">
      <input
        type="text"
        {...rest}
      />
    </div>
  );
}
