import { motion } from "framer-motion";

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
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "tween", duration: 0.2 }}
      className={`relative rounded-2xl p-6 cursor-pointer ${className} border border-gray-700 bg-black`}
    >
      <div id="icon-title-part" className="flex flex-row items-center gap-2">
        <div id="img-part" className="flex">
          <img src={iconURL} alt="icon" className="w-6 h-6" />
        </div>
        <div className="flex text-xl font-bold text-primary">{title}</div>
      </div>

      <div className="text-base text-gray-200 mt-2">{description}</div>
    </motion.div>
  );
}
