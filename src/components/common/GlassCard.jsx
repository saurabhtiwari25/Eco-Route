const GlassCard = ({ children, className = "" }) => {
  return (
    <div
      className={`
        bg-white/10 
        backdrop-blur-md 
        border border-white/10 
        rounded-2xl 
        p-4 
        shadow-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;