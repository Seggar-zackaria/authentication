// "use client"
// import { Card } from "@/components/ui/card";
// import Image from "next/image";
// import NavBar from "@/components/home-page-component/nav-bar";
// import { DestinationSelect } from "@/components/home-page-component/destination-select";
// import { useState } from "react";

// export default function Home() {
//   const [selectedDestination, setSelectedDestination] = useState("");

//   return (
//     <main className="relative min-h-screen w-full overflow-x-hidden">
//       {/* Background Image with proper next/image optimization */}
//       <div className="absolute inset-0 z-0">
//         <Image
//           src='/assets/mountains.jpg' 
//           alt="Mountain lake landscape"
//           fill
//           sizes="100vw"
//           quality={90}
//           className="object-cover"
//           priority
//           placeholder="blur"
//           blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0XFyAeIRshIRshHRkdIR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/30" />
//       </div>

//       {/* Content */}
//       <div className="relative z-10">
//         <NavBar />

//         <div className="container mx-auto px-4">
//           {/* Hero Section with responsive text sizes */}
//           <div className="text-center text-white mt-16 sm:mt-24 lg:mt-32 mb-8 sm:mb-12 lg:mb-16 space-y-4">
//             <h2 className="text-2xl sm:text-3xl font-medium tracking-wide">
//               Helping Others
//             </h2>
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
//               LIVE & TRAVEL
//             </h1>
//             <p className="text-lg sm:text-xl text-gray-100">
//               Special offers to suit your plan
//             </p>
//           </div>

//           {/* Search Card with improved responsive layout */}
//           <div className="container max-w-4xl mx-auto">
//             <Card className="p-6 sm:p-8">
//               <div className="space-y-6">
//                 {/* Destination Section */}
//                 <div className="w-full">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Where would you like to go?
//                   </label>
//                   <DestinationSelect 
//                     value={selectedDestination}
//                     onChange={setSelectedDestination}
//                     placeholder="Search your destination..."
//                   />
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
