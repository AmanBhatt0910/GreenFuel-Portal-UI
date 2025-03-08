"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export const HospitalParallax = ({
  departments,
  doctors,
  services,
}: {
  departments: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
  doctors: {
    name: string;
    specialty: string;
    link: string;
    thumbnail: string;
  }[];
  services: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = departments.slice(0, 5);
  const secondRow = doctors.slice(0, 5);
  const thirdRow = services.slice(0, 5);
  
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <div className="mb-24 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-blue-700 mb-8">Our Departments</h2>
          <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
            {firstRow.map((department) => (
              <DepartmentCard
                department={department}
                translate={translateX}
                key={department.title}
              />
            ))}
          </motion.div>
        </div>
        
        <div className="mb-24 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-blue-700 mb-8">Our Specialists</h2>
          <motion.div className="flex flex-row mb-20 space-x-20">
            {secondRow.map((doctor) => (
              <DoctorCard
                doctor={doctor}
                translate={translateXReverse}
                key={doctor.name}
              />
            ))}
          </motion.div>
        </div>
        
        <div className="mb-24 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-blue-700 mb-8">Our Services</h2>
          <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
            {thirdRow.map((service) => (
              <ServiceCard
                service={service}
                translate={translateX}
                key={service.title}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold text-blue-800">
        HealthCare <br /> Excellence Center
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-gray-700">
        Your partner in health and healing. We provide world-class medical care with compassion and 
        cutting-edge technology. Our skilled professionals are dedicated to your well-being and recovery.
      </p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10"
      >
        <Link 
          href="/appointment" 
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          Book an Appointment
        </Link>
      </motion.div>
    </div>
  );
};

export const DepartmentCard = ({
  department,
  translate,
}: {
  department: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={department.title}
      className="group/department h-96 w-[30rem] relative shrink-0 rounded-xl overflow-hidden"
    >
      <Link
        href={department.link}
        className="block group-hover/department:shadow-2xl"
      >
        <Image
          src={department.thumbnail}
          height="600"
          width="600"
          className="object-cover object-center absolute h-full w-full inset-0"
          alt={department.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/department:opacity-80 bg-blue-900 pointer-events-none transition-opacity"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/department:opacity-100 text-white text-xl font-semibold transition-opacity">
        {department.title}
      </h2>
    </motion.div>
  );
};

export const DoctorCard = ({
  doctor,
  translate,
}: {
  doctor: {
    name: string;
    specialty: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={doctor.name}
      className="group/doctor h-96 w-[30rem] relative shrink-0 rounded-xl overflow-hidden"
    >
      <Link
        href={doctor.link}
        className="block group-hover/doctor:shadow-2xl"
      >
        <Image
          src={doctor.thumbnail}
          height="600"
          width="600"
          className="object-cover object-center absolute h-full w-full inset-0"
          alt={doctor.name}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/doctor:opacity-80 bg-gradient-to-t from-blue-900 to-transparent pointer-events-none transition-opacity"></div>
      <div className="absolute bottom-4 left-4 opacity-0 group-hover/doctor:opacity-100 text-white transition-opacity">
        <h2 className="text-xl font-semibold">{doctor.name}</h2>
        <p className="text-blue-200">{doctor.specialty}</p>
      </div>
    </motion.div>
  );
};

export const ServiceCard = ({
  service,
  translate,
}: {
  service: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={service.title}
      className="group/service h-96 w-[30rem] relative shrink-0 rounded-xl overflow-hidden"
    >
      <Link
        href={service.link}
        className="block group-hover/service:shadow-2xl"
      >
        <Image
          src={service.thumbnail}
          height="600"
          width="600"
          className="object-cover object-center absolute h-full w-full inset-0"
          alt={service.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/service:opacity-80 bg-gradient-to-t from-green-900 to-blue-900 pointer-events-none transition-opacity"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/service:opacity-100 text-white text-xl font-semibold transition-opacity">
        {service.title}
      </h2>
    </motion.div>
  );
};

// Page component that uses the HospitalParallax
export default function HospitalPortal() {
  // Sample data - in a real application, this would come from an API or CMS
  const departments = [
    {
      title: "Cardiology",
      link: "/departments/cardiology",
      thumbnail: "https://images.unsplash.com/photo-1595277401674-c0a8c59b508b",
    },
    {
      title: "Neurology",
      link: "/departments/neurology",
      thumbnail: "https://images.unsplash.com/photo-1581094296489-31e33ff8dbd5",
    },
    {
      title: "Orthopedics",
      link: "/departments/orthopedics",
      thumbnail: "https://images.unsplash.com/photo-1581280336905-0d9d9f7cf708",
    },
    {
      title: "Pediatrics",
      link: "/departments/pediatrics",
      thumbnail: "https://images.unsplash.com/photo-1533271364584-2e78c85d8c83",
    },
    {
      title: "Oncology",
      link: "/departments/oncology",
      thumbnail: "https://images.unsplash.com/photo-1581094296489-31e33ff8dbd5",
    },
  ];
  
  const doctors = [
    {
      name: "Dr. John Smith",
      specialty: "Cardiologist",
      link: "/doctors/john-smith",
      thumbnail: "https://images.unsplash.com/photo-1506748686219-8852380bcf8b",
    },
    {
      name: "Dr. Sarah Johnson",
      specialty: "Neurologist",
      link: "/doctors/sarah-johnson",
      thumbnail: "https://images.unsplash.com/photo-1573164574399-e3e0be10ac88",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Orthopedic Surgeon",
      link: "/doctors/michael-chen",
      thumbnail: "https://images.unsplash.com/photo-1522261462911-688b4f8fbd3e",
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      link: "/doctors/emily-rodriguez",
      thumbnail: "https://images.unsplash.com/photo-1572201428-11d0ac6a8b2b",
    },
    {
      name: "Dr. Robert Anderson",
      specialty: "Oncologist",
      link: "/doctors/robert-anderson",
      thumbnail: "https://images.unsplash.com/photo-1556742044-8c00e78b9f97",
    },
  ];
  
  const services = [
    {
      title: "Emergency Care",
      link: "/services/emergency-care",
      thumbnail: "https://images.unsplash.com/photo-1592364438720-8f01a57339f7",
    },
    {
      title: "Diagnostic Services",
      link: "/services/diagnostic",
      thumbnail: "https://images.unsplash.com/photo-1596465573789-43ed13f7a08e",
    },
    {
      title: "Rehabilitation",
      link: "/services/rehabilitation",
      thumbnail: "https://images.unsplash.com/photo-1601872793073-b1c081ff8d1e",
    },
    {
      title: "Telemedicine",
      link: "/services/telemedicine",
      thumbnail: "https://images.unsplash.com/photo-1574168200160-8a4d72a43a1e",
    },
    {
      title: "Preventive Care",
      link: "/services/preventive-care",
      thumbnail: "https://images.unsplash.com/photo-1511932871607-d0e6ca4ca300",
    },
  ];
  

  return (
    <main className="bg-gray-50 min-h-screen">
      <HospitalParallax 
        departments={departments}
        doctors={doctors}
        services={services}
      />
      
      {/* Additional sections like testimonials, locations, etc. can be added below */}
      <footer className="bg-blue-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">HealthCare Excellence Center</h3>
            <p>123 Medical Avenue</p>
            <p>Healthville, HV 12345</p>
            <p className="mt-4">Phone: (123) 456-7890</p>
            <p>Email: contact@healthcareexcellence.com</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-blue-300">About Us</Link></li>
              <li><Link href="/doctors" className="hover:text-blue-300">Our Doctors</Link></li>
              <li><Link href="/services" className="hover:text-blue-300">Services</Link></li>
              <li><Link href="/contact" className="hover:text-blue-300">Contact Us</Link></li>
              <li><Link href="/emergency" className="hover:text-blue-300">Emergency</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Hours</h3>
            <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
            <p>Saturday: 8:00 AM - 5:00 PM</p>
            <p>Sunday: 9:00 AM - 3:00 PM</p>
            <p className="mt-4 font-bold text-red-300">Emergency: 24/7</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-blue-800 text-center">
          <p>&copy; 2025 HealthCare Excellence Center. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}