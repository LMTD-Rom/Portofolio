import React from "react";

export default function Lanyard() {
  return (
    <div className="flex items-center justify-center">
      <img
      src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiyHjY58i-Bzaa7DF1o_33KkMPdlnnY3wtf1KQl8Fz-UwmEhKetCnTVRAOcPvZyTGtu7v5WZdFBIcr4tuoeugXYkYbg2-tk1OvIUrzeVK94lDug8aueAQZy7IininwdTjuD_Mg5bendB7g/s320/logo-universitas-bina-sarana-informatika-ubsi.png"
        alt="Lanyard Foto"
        className="avatar"
        style={{
          width: "900%",
          maxWidth: "900px",
          borderRadius: "30px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          objectFit: "cover",
          background: "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)",
        }}
      />
    </div>
  );
}
