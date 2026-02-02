export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-white py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-40 -bottom-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-balance">
          Where Should You Go?
        </h1>
        <p className="text-xl md:text-2xl opacity-90 mb-8 text-pretty">
          Discover amazing travel destinations tailored to your budget, timeline, and interests
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-2xl">✈️</span>
            <span>Adventure awaits</span>
          </div>
        </div>
      </div>
    </section>
  )
}
