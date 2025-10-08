import { signOut, useSession } from "next-auth/react";
import SKITLogo from "./SKITLogo";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export default function Header({header} : {header : string}){
    const {data: session} = useSession();
    
    const handleLogout = () => {
        signOut({
            callbackUrl: "/"
        })
    }
    return <div className="sticky top-0 z-50">
        <header className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SKITLogo />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{header}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">{session?.user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
    </div>
}