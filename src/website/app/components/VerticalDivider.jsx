const VerticalDivider = () => {
  return (
    <div className="flex items-center">
      {/* Left Block */}
      <div className="block p-4 bg-gray-100">Left Block</div>

      {/* Vertical Divider */}
      <div className="h-full border-l border-gray-300 mx-4"></div>

      {/* Right Block */}
      <div className="block p-4 bg-gray-100">Right Block</div>
    </div>
  );
};

export default VerticalDivider;
