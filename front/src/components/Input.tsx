export default function Input({ placeText }: { placeText: string }) {
  return (
    <input
      type="text"
      className="w-60 h-10 rounded-[4px] border text-sm px-4 placeholder:text-[#acacac]"
      placeholder={placeText}
    />
  );
}
