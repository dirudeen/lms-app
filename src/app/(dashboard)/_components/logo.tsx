import Image from "next/image";

export default function Logo() {
  return (
    <Image 
    src="/assets/logo.svg"
    alt="Logo"
    width={400}
    height={400}
    priority
    />
  )
}
