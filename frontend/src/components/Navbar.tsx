const Navbar = () => {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">
          Bus Booking System | AppWeave{" "}
        </h1>

        <div className="space-x-6 text-sm text-gray-600">
          <span className="cursor-pointer hover:text-black">Home</span>
          <span className="cursor-pointer hover:text-black">Bookings</span>
          <span className="cursor-pointer hover:text-black">Help</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
