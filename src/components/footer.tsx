import Image from "next/image";
import Link from "next/link";



export default function Footer() {
  const date = new Date();
  return (
    <div className="realtive mt-5 bottom-0">
      <hr />
      <div className="relative mx-auto max-w-7xl">
        <footer className="px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center">
            <span>
              <Image
                src="/images/logo.png"
                width={40}
                height={40}
                alt="FormPlace logo"
              />
            </span>
            <div className="mt-4 grow md:ml-12 md:mt-0">
              <p className="text-base font-semibold text-gray-700">
                © {date.getFullYear()} FormPlace. &nbsp;
              </p>
              <p className="text-base font-semibold text-gray-700">
                Developed by <Link href="https://www.linkedin.com/in/harsh-kumar-21a5a4256/" className='underline font-extrabold'>Harsh Kumar</Link>. All rights reserved.
              </p>

            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
