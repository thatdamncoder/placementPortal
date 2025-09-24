import Image from "next/image";
import { redirect } from "next/navigation";

export default function SKITLogo({width = 60, height = 60}){
    return <div>
        <Image 
            src="/skit_logo.png" 
            alt="skit logo here" 
            width={width} 
            height={height}
        />
    </div>
}