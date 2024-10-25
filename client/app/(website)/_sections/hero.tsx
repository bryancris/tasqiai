import { SparklesIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/util/tw-merge';
import { FadeOnView } from '../_components/fade-on-view';
import Blur1 from '@/public/static/bg-blur-1.webp';

export default function Hero() {
  return (
    <section className="px-6 flex flex-col justify-center text-center relative bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 min-h-screen overflow-hidden bg-fixed bg-opacity-90">
      <div className="min-h-[30vh] py-8">
        <FadeOnView>
          <Badge variant="secondary" className="w-fit mx-auto bg-blue-900/90 border border-blue-200/50 backdrop-blur-sm shadow-xl">
            <SparklesIcon className="w-4 h-4 mr-2" />
            AI-Powered Task & Project Management
          </Badge>
        </FadeOnView>
        <FadeOnView delay={0.2}>
          <h1 className="heading vertical-gradient lg:text-7xl sm:flex-center gap-2 sm:gap-4 py-4 md:py-6 text-white">
            Empower Your Tasks with AI
          </h1>
        </FadeOnView>
        <FadeOnView delay={0.4}>
          <p className="text-blue-50 md:text-lg font-medium tracking-wide drop-shadow-lg">
            Experience intelligent task management with AI-powered productivity tools
          </p>
        </FadeOnView>
        <div className="flex-gap justify-center">
          <FadeOnView delay={0.6} className="space-x-2 mt-6">
            <Button className="rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6">Get Started</Button>
          </FadeOnView>
          <FadeOnView delay={0.7} className="space-x-2 mt-6">
            <Button className="rounded-full shadow-xl border-blue-300/50 hover:bg-blue-800/50" variant="outline">
              GitHub
            </Button>
          </FadeOnView>
        </div>
      </div>
      <FadeOnView
        delay={1}
        className="hero-border-animation max-w-screen-xl mx-auto mt-16 p-[1px] rounded-[1rem] bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 shadow-2xl border border-blue-200/40"
        style={{
          maskImage: 'linear-gradient(to bottom, rgb(0, 0, 255) 100%, transparent 100%)'
        }}
      >
        <div
          className={cn(
            'rounded-[1rem] overflow-hidden p-2 z-10',
            'bg-gradient-to-b from-blue-800 to-blue-700 backdrop-blur-sm',
          )}
        >
          <div className="z-10">
            <Image
              src="/hero-1.png"
              alt="App image"
              width={1920}
              height={1080}
              className="rounded-[12px] overflow-hidden z-10 border border-blue-200/40 relative shadow-2xl"
            />
            <Image
              src={Blur1}
              alt="background blur"
              className="opacity-80 absolute"
            />
          </div>
        </div>
      </FadeOnView>
    </section>
  );
}