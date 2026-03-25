const GlassCard = ({ children, className = "" }) => {
  return (
    <div
      className={`
        bg-white/[0.03] 
        backdrop-blur-xl 
        
        border border-white/10
        border-t-white/20 
        border-l-white/20
        
        rounded-2xl 
        p-6 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]
        
        before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.05] before:to-transparent before:-z-10
        relative overflow-hidden
        
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;