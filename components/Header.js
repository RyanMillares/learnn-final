import Link from 'next/Link'
import { supabase } from '../utils/supabaseClient'


export default function Header({currPage}) {
    const user = supabase.auth.user()
    return (
        <div class = "HeaderBar">
            <div class = "menuItems">
            <nav>
            <Link href="/">
                <div className="logo">
                <svg className="lightbulb" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h1 className = "text-5xl font-bold">Learn'N</h1>
                </div>
            </Link>
            <Link href="/groups" className="link"><a>Groups</a></Link>
            <Link href="/groups/forums" className="link"><a>Forums</a></Link>
            <a href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ">Free Offers</a>

            <div class = "profileDisplay">
                {
                    (user != null) && (
                        (user.email).split("@")[0]
                    )
               
                }
            </div>
            </nav>  
    
            
            </div>
            
        </div>
        
        
    )
}