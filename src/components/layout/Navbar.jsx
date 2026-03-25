// Update components/layout/Navbar.jsx
const Navbar = () => {
  return (
    // Wrap the entire navbar content in the GlassCard effect
    <div className="w-full bg-white/10 backdrop-blur-md border-b border-white/10 p-4 flex justify-between">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <span className="text-sm opacity-80">Admin</span>
    </div>
  );
};

export default Navbar; // <--- ADD THIS LINE