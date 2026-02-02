
import Link from "next/link"
import Image from "next/image"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-20 items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <div className="relative h-20 w-80">
                            <Image
                                src="https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/f060973ef49346d0bfdcbb51b6ba880b?ik-sanitizeSvg=true"
                                alt="TripFactory Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Add search or other nav items here if needed */}
                    </div>
                    <nav className="flex items-center">
                        {/* Add social icons or login buttons here */}
                    </nav>
                </div>
            </div>
        </header>
    )
}
