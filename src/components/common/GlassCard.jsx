 const GlassCard = ({ children, className = "" }) => {
  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;