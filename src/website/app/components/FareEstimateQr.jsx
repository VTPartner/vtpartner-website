const FareEstimateQr = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-white text-black m-4 rounded-md shadow-md mt-10">
      {/* Heading */}
      <h3 className="text-2xl font-semibold mb-4">For more details</h3>

      {/* QR Wrapper */}
      <div className="flex flex-col items-center">
        {/* QR Code Container */}
        <div className="relative w-24 h-24 mb-2">
          {/* Image Placeholder */}
          <img
            alt="Download Porter QR Image"
            src="https://dom-website-prod-cdn-web.porter.in/public/images/fare-estimate-result/download-qr-code.png"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {/* Sub-heading */}
        <p className="text-sm text-black-100">Scan to download our app</p>
      </div>
    </div>
  );
};

export default FareEstimateQr;
