import React from "react";

export default function Footer() {
  let footerStlye = {
    bottom: 0,
    width: "100%",
  };
  return (
    <footer
      className="bg-dark text-light text-center p-4 border border-5 border-danger rounded fs-4"
      style={footerStlye}
    >
      Copyright&copy;IpfsImageUploader.com
    </footer>
  );
}
