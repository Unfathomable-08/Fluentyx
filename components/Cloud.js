import { motion } from "framer-motion";

const Cloud = () => {
  return (
    <div className="relative h-[80px] w-[450px] transform scale-120">
      <motion.div
        className="relative filter drop-shadow-[0_0_0px_var(--primary)]"
        initial={{ filter: "drop-shadow(0 0 0px var(--primary))" }}
        whileInView={{
          filter: [
            "drop-shadow(0 0 0px var(--primary))",
            "drop-shadow(0 0 7px var(--primary))",
            "drop-shadow(0 0 5px var(--primary))",
            "drop-shadow(0 0 0px var(--primary))",
            "drop-shadow(0 0 8px var(--primary))",
            "drop-shadow(0 0 5px var(--primary))",
            "drop-shadow(0 0 0px var(--primary))",
          ],
        }}
        transition={{ duration: 5 }}
      >

        <div className="absolute bg-[var(--primary)] rounded-full w-20 h-20 top-4 left-12"></div>
        <div className="absolute bg-[var(--primary)] rounded-full w-24 h-24 top-0 left-24"></div>
        <div className="absolute bg-[var(--primary)] rounded-full w-28 h-28 -top-8 left-40"></div>
        <div className="absolute bg-[var(--primary)] rounded-full w-20 h-20 top-4 left-60"></div>
        <div className="absolute bg-[var(--primary)] rounded-full w-20 h-20 top-2 left-70"></div>
        <div className="absolute bg-[var(--primary)] rounded-full w-18 h-18 top-2 left-84"></div>
        <div className="absolute bg-[var(--primary)] rounded-full w-16 h-16 top-6 left-96"></div>
        <div className="absolute bg-[var(--primary)] rounded-full w-22 h-22 -top-2 left-104"></div>
        <div className="absolute bg-[var(--primary)] rounded-full w-20 h-20 top-2 left-120"></div>
      </motion.div>
    </div>
  );
};

export default Cloud;