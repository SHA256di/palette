'use client'

import Image from 'next/image'

export default function WishlistStaticLayout({ originalImage }: { originalImage?: string | null }) {
  const items = [
    { src: '/images/wishlist/boots.jpg', caption: "dream boots to walk into another life" },
    { src: '/images/wishlist/candle.jpg', caption: "candlelight for late night musings" },
    { src: '/images/wishlist/miumiubag.jpg', caption: "a miu miu bag styled in jane birkin way" },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-light text-center mb-8 text-gray-800 tracking-wide">
        a girl’s wishlist
      </h2>

      <div className="grid grid-cols-2 gap-8">
        {/* User uploaded image goes in the first slot */}
        {originalImage && (
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={originalImage}
                alt="your product"
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-2 text-sm italic text-gray-600">your product</p>
          </div>
        )}

        {/* Hardcoded images */}
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={item.src}
                alt={item.caption}
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-2 text-sm italic text-gray-600 text-center">{item.caption}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
