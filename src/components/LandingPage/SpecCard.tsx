import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Props = {
  title: string;
  description: string;
  iconURL: string;
  className?: string;
};

export default function SpecCard({
  title,
  description,
  iconURL,
  className,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "tween", duration: 0.2 }}
      className={`relative rounded-2xl p-6 cursor-pointer ${className} border border-gray-700 bg-black`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <div className="flex">
            <img src={iconURL} alt="icon" className="w-6 h-6" />
          </div>
          <div className="text-xl font-bold text-primary">{title}</div>
        </div>

        <div className="focus:outline-none md:hidden">
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
            <ChevronDownIcon className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      {/* Always visible on large devices */}
      <div className="hidden md:block">
        <div className="text-base text-gray-200 mt-2">{description}</div>
      </div>

      {/* Mobile devices: description toggles */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="text-base text-gray-200 mt-2">{description}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
