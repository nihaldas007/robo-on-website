"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, Settings, Cuboid, Code, Laptop, ArrowRight, Share2 } from "lucide-react";

export default function Services() {
  const services = [
    { 
      id: "embedded",
      title: "Embedded Systems", 
      icon: Cpu, 
      shortDesc: "Custom firmware and hardware solutions.",
      description: "We design and develop robust embedded systems tailored to your specific requirements. From microcontrollers to microprocessors, our firmware ensures optimal hardware performance, power efficiency, and seamless integration.",
      features: ["Firmware Development", "RTOS Integration", "Hardware Bring-up", "Low-power Design"]
    },
    { 
      id: "robotics",
      title: "Robotics", 
      icon: Zap, 
      shortDesc: "Automated systems and intelligent robots.",
      description: "Our robotics experts build intelligent, automated systems for industrial, commercial, and research applications. We cover kinematics, control systems, and computer vision integration.",
      features: ["Autonomous Navigation", "Manipulator Kinematics", "ROS 2 Integration", "Computer Vision"]
    },
    { 
      id: "pcb",
      title: "PCB Design", 
      icon: Settings, 
      shortDesc: "Professional schematic and layout services.",
      description: "Transform your circuit ideas into production-ready physical boards. We provide comprehensive schematic capture, high-speed PCB layout, and design for manufacturing (DFM) verification.",
      features: ["Multi-layer Boards", "High-speed Design", "RF Layouts", "BOM Optimization"]
    },
    { 
      id: "3d",
      title: "3D Design", 
      icon: Cuboid, 
      shortDesc: "Rapid prototyping and CAD modeling.",
      description: "Accelerate your product development with our precision 3D modeling and rapid prototyping services. We prepare designs for 3D printing, CNC machining, and injection molding.",
      features: ["SolidWorks / Fusion360", "Enclosure Design", "DFM Analysis", "Renderings"]
    },
    { 
      id: "software",
      title: "App & Web Development", 
      icon: Code, 
      shortDesc: "Modern, scalable software applications.",
      description: "We build intuitive, scalable web and mobile applications that connect seamlessly with your hardware ecosystems or stand alone as powerful digital products.",
      features: ["React / Next.js", "React Native", "Cloud Architecture", "UI/UX Design"]
    },
    { 
      id: "iot",
      title: "IoT Projects", 
      icon: Laptop, 
      shortDesc: "Connected devices and cloud platforms.",
      description: "End-to-end Internet of Things solutions. We bridge the gap between edge devices and cloud infrastructure, enabling real-time monitoring and data analytics.",
      features: ["Sensor Integration", "MQTT/CoAP protocols", "Cloud Dashboards", "Edge Computing"]
    },
  ];

  return (
    <div className="w-full flex justify-center pb-32 relative overflow-hidden">
      <div className="absolute top-40 right-0 translate-x-1/4 text-primary/5 pointer-events-none -z-10">
         <Share2 size={800} strokeWidth={0.5} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Our <span className="text-primary">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Comprehensive engineering and software solutions designed to bring your most ambitious ideas to life.
          </motion.p>
        </div>

        <div className="flex flex-col gap-24">
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full md:w-1/2">
                <div className="glass-card p-10 rounded-2xl aspect-square flex flex-col justify-center items-center text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <service.icon size={80} className="text-primary mb-8 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400 mb-0">{service.shortDesc}</p>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-6xl font-extrabold text-white/5">0{index + 1}</span>
                  <h2 className="text-3xl font-bold">{service.title}</h2>
                </div>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  {service.description}
                </p>
                
                <h4 className="text-white font-semibold mb-4 text-lg">Key Capabilities:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {service.features.map(feature => (
                    <li key={feature} className="flex items-center gap-3 text-gray-300">
                      <ArrowRight size={16} className="text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black px-8 py-3 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(11,244,227,0.3)] hover:shadow-[0_0_25px_rgba(11,244,227,0.6)]">
                  Request a Quote
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
