import React from "react";
import { Image } from "@imagekit/react";

const Image1 = ({ src, className, w, h, alt }) => {
  // If no src provided or src is a hardcoded placeholder, show a placeholder
  if (!src || src === "1.png" || src === "image.png") {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-500">No Image</span>
      </div>
    );
  }



  return (
    <div>
      <Image
        urlEndpoint={import.meta.env.VITE_YOUR_IMAGEKIT_URL_ENDPOINT}
        className={className}
        path={src}
        loading="lazy"
        alt={alt || "Uploaded image"}
        width={w}
        height={h}
        onError={(e) => {
          console.error('Image failed to load:', src);
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};

export default Image1;
