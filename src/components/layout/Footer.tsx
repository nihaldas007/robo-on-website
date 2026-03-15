import Link from "next/link";
import NextImage from "next/image";
import logo from "../../../public/logo.png";
import { Cpu, Facebook, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-lg relative z-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <NextImage 
                src={logo} 
                alt="RoboON Logo" 
                className="h-16 w-auto object-contain transition-transform group-hover:scale-105 brightness-0 invert opacity-90" 
              />
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Empowering innovation through Embedded Systems, Robotics, PCB Design, and cutting-edge software solutions.
            </p>
            <div className="flex space-x-4 mb-4">
              <a href="https://www.facebook.com/share/18T88T3vcP/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="mailto:roboonbd@gmail.com" className="text-gray-400 hover:text-primary transition-colors">
                <Mail size={20} />
              </a>
              <a href="https://wa.me/8801319759370" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                 <Phone size={20} />
              </a>
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Email: <a href="mailto:roboonbd@gmail.com" className="hover:text-primary">roboonbd@gmail.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/8801319759370" className="hover:text-primary">+880 1319-759370</a></p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/services#embedded" className="hover:text-primary transition-colors">Embedded Systems</Link></li>
              <li><Link href="/services#robotics" className="hover:text-primary transition-colors">Robotics</Link></li>
              <li><Link href="/services#pcb" className="hover:text-primary transition-colors">PCB Design</Link></li>
              <li><Link href="/services#3d" className="hover:text-primary transition-colors">3D Design</Link></li>
              <li><Link href="/services#software" className="hover:text-primary transition-colors">App & Web Dev</Link></li>
              <li><Link href="/services#iot" className="hover:text-primary transition-colors">IoT Projects</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Learn</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/courses" className="hover:text-primary transition-colors">All Courses</Link></li>
              <li><Link href="/courses/iot" className="hover:text-primary transition-colors">Internet of Things</Link></li>
              <li><Link href="/courses/robotics" className="hover:text-primary transition-colors">Basic Robotics</Link></li>
              <li><Link href="/courses/pcb-design" className="hover:text-primary transition-colors">PCB Design Masterclass</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} RoboON. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed and built with precision.</p>
        </div>
      </div>
    </footer>
  );
}
