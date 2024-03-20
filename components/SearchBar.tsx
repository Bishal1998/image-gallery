import { cn } from "@/lib/utils";
import { IoIosSearch } from "react-icons/io";
import { Input } from "./ui/input";
import { ChangeEventHandler } from "react";

type SearchBarProps = {
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string | number | readonly string[] | undefined;
};

const SearchBar = ({ className, value, onChange }: SearchBarProps) => {
  return (
    <div className={cn("w-full relative flex items-center", className)}>
      <IoIosSearch className="absolute left-5 text-gray-500" />
      <Input
        type="text"
        placeholder="Search Image"
        value={value}
        onChange={onChange}
        className="w-full h-12 pl-12 outline-blue-300 bg-gray-300 dark:bg-gray-800 focus-visible:ring-0 focus-visible:outline-none"
      />
    </div>
  );
};

export default SearchBar;
