import Link from "next/link";
import Navbar from "@/components/Shared/Navbar/Navbar";
import Footer from "@/components/Footer";
import WedoraLogo from "@/components/WedoraLogo";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex pt-16">
        {/* Bento Grid Panel */}
        <div className="hidden lg:flex lg:w-[50%] xl:w-[55%] relative overflow-hidden bg-charcoal items-center justify-center p-8">
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black/60 z-10" />

          {/* Bento Grid Background */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-2">
            {/* Row 1 */}
            <div className="col-span-1 row-span-1 rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 row-span-2 rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=800&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 row-span-1 rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>

            {/* Row 2 */}
            <div className="col-span-1 row-span-1 rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 row-span-1 rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>

            {/* Row 3 */}
            <div className="col-span-1 row-span-1 rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 row-span-1 rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Text Overlay */}
          <div className="relative z-20 text-center max-w-md px-8">
            <WedoraLogo className="h-14 w-14 mx-auto mb-8" />
            <h1 className="font-display text-4xl xl:text-5xl font-light text-white mb-3 leading-tight tracking-tight">
              Every contribution<br />remembered.
            </h1>
            <div className="w-12 h-[1px] bg-muted-gold/40 mx-auto my-6" />
            <p className="font-display text-lg text-white/50 italic">
              Every moment preserved.
            </p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-[420px]">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-10 lg:hidden">
              <WedoraLogo className="h-7 w-7" />
              <span className="font-display text-xl font-semibold text-deep-brown dark:text-foreground tracking-tight">Wedora</span>
            </Link>
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
