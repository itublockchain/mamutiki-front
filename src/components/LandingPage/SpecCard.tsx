import { motion } from "framer-motion";

type Props = {
  title: string;
  description: string;
  className?: string;
};

export default function SpecCard({ title, description, className }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "tween", duration: 0.2 }}
      className={`relative rounded-3xl p-6 cursor-pointer ${className} border border-gray-800`}
    >
      <div className="text-2xl font-bold text-yellow-500">{title}</div>
      <div className="text-base text-gray-200 mt-2">{description}</div>
    </motion.div>
  );
}
