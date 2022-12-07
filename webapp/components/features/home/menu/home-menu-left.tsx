/* eslint-disable jsx-a11y/alt-text */
import Link from "next/link"

export const HomeMenuLeft = () => {
  return (
    <div className="p-1 max-h-full w-[230px]">
      <Link href="/">
        <div className="font-bold text-lg text-primary-color cursor-pointer h-[100px]">
          <img className="max-h-[100%] block" src="/assets/images/logo.png" />
        </div>
      </Link>
    </div>
  )
}
