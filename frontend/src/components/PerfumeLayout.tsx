import React from "react";

type PerfumeItem = {
  image: string;
  caption: string;
};

type PerfumeLayoutProps = {
  originalImage?: string | null;
  originalImageName?: string;
};

export default function PerfumeLayout({
  originalImage,
  originalImageName = "your product",
}: PerfumeLayoutProps) {
  // Static images from public directory
  const staticTopNotes: PerfumeItem[] = [
    { image: "/images/perfume/top/vanilla.jpeg", caption: "sweet vanilla" },
    { image: "/images/perfume/top/cherries.jpeg", caption: "fresh cherries" },
  ];

  const staticMiddleNotes: PerfumeItem[] = [
    { image: "/images/perfume/middle/book.jpg", caption: "old books" },
    { image: "/images/perfume/middle/coffee.jpeg", caption: "morning coffee" },
    { image: "/images/perfume/middle/chloebag.jpeg", caption: "luxury leather" },
  ];

  const staticBaseNotes: PerfumeItem[] = [
    { image: "/images/perfume/base/lana_album.jpeg", caption: "nostalgic melodies" },
    { image: "/images/perfume/base/lavender.jpeg", caption: "calming lavender" },
    { image: "/images/perfume/base/figs.jpeg", caption: "Mediterranean figs" },
  ];

  // Add original image to top notes if available
  const topNotes: PerfumeItem[] = originalImage 
    ? [{ image: originalImage, caption: originalImageName }, ...staticTopNotes].slice(0, 4)
    : staticTopNotes;

  const middleNotes = staticMiddleNotes.slice(0, 4);
  const baseNotes = staticBaseNotes.slice(0, 4);
  const renderRow = (label: string, items: PerfumeItem[]) => (
    <div className="mb-8">
      <h2 className="text-xl font-light italic mb-4 text-center">{label}:</h2>
      <div className="grid grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <img
              src={item.image}
              alt={item.caption}
              className="h-24 w-24 object-contain mb-2"
            />
            <p className="text-sm italic">{item.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-10 rounded-lg shadow max-w-5xl mx-auto">
      <h1 className="text-3xl font-serif text-center mb-10">me as a perfume</h1>

      {renderRow("top notes", topNotes)}
      {renderRow("middle notes", middleNotes)}
      {renderRow("base notes", baseNotes)}
    </div>
  );
}

