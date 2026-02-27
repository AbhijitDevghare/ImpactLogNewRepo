import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

export default function SearchBar() {
  const placeholders = ["Search events or groups", "Search NGOs...", "Find Events..."];

  return (
    <div className="w-full">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={(e) => console.log(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          console.log("submitted");
        }}
        containerClassName="w-full"
        className=""
      />
    </div>
  );
}
