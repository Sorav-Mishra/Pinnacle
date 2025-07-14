// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import Image from "next/image";

// import "swiper/css";
// import "swiper/css/pagination";

// const HeroSection: React.FC = () => {
//   return (
//     <div className="w-full">
//       {/* SEO Banners Carousel */}
//       <div className="w-full my-2 flex justify-center px-0">
//         <div className="w-full">
//           <Swiper
//             modules={[Autoplay, Pagination]}
//             spaceBetween={30}
//             slidesPerView={1}
//             autoplay={{
//               delay: 3500,
//               disableOnInteraction: false,
//             }}
//             pagination={{ clickable: true }}
//             loop={true}
//           >
//             {/* Slide 1 */}
//             <SwiperSlide>
//               <div className="flex items-center bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl p-6 mx-4 shadow-xl">
//                 <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white mr-6 shadow-md overflow-hidden">
//                   {/* <Image
//                     src="https://upload.wikimedia.org/wikipedia/en/2/2d/Staff_Selection_Commission_logo.png"
//                     alt="SSC Logo"
//                     width={56}
//                     height={56}
//                     className="w-14 h-14 object-contain"
//                   /> */}
//                 </div>
//                 <div className="text-white space-y-2">
//                   <h2 className="text-3xl font-bold">About Pinnacle Online</h2>
//                   <p className="text-sm leading-relaxed opacity-90">
//                     <strong>Pinnacle Online</strong> is India's trusted free
//                     platform for SSC exam preparation. Access 20,000+ previous
//                     year questions for CGL, CHSL, MTS, GD, CPO, JE, and more.
//                   </p>
//                 </div>
//               </div>
//             </SwiperSlide>

//             {/* Slide 2 */}
//             <SwiperSlide>
//               <div className="flex items-center bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-2xl p-6 mx-4 shadow-xl">
//                 <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white mr-6 shadow-md overflow-hidden">
//                   {/* <Image
//                     src="https://upload.wikimedia.org/wikipedia/en/2/2d/Staff_Selection_Commission_logo.png"
//                     alt="SSC Logo"
//                     width={56}
//                     height={56}
//                     className="w-14 h-14 object-contain"
//                   /> */}
//                 </div>
//                 <div className="text-white space-y-2">
//                   <h2 className="text-3xl font-bold">
//                     About SSC PYQs Practice
//                   </h2>
//                   <p className="text-sm leading-relaxed opacity-90">
//                     Practice <strong>SSC PYQs</strong> with topic-wise
//                     categorization, detailed solutions, and smart analytics.
//                   </p>
//                 </div>
//               </div>
//             </SwiperSlide>

//             {/* Slide 3 */}
//             <SwiperSlide>
//               <div className="flex items-center bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl p-6 mx-4 shadow-xl">
//                 <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white mr-6 shadow-md overflow-hidden">
//                   {/* <Image
//                     src="https://upload.wikimedia.org/wikipedia/en/2/2d/Staff_Selection_Commission_logo.png"
//                     alt="SSC Logo"
//                     width={56}
//                     height={56}
//                     className="w-14 h-14 object-contain"
//                   /> */}
//                 </div>
//                 <div className="text-white space-y-2">
//                   <h2 className="text-3xl font-bold">Smart Analytics</h2>
//                   <p className="text-sm leading-relaxed opacity-90">
//                     Track your progress with detailed reports, weak topic
//                     identification, and improve faster with Pinnacle Analytics.
//                   </p>
//                 </div>
//               </div>
//             </SwiperSlide>
//           </Swiper>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;
