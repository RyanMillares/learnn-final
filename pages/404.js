import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import Header from "../components/Header";
export default function Custom404() {
    const router = useRouter()
    useEffect(() => {
        router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    })
    return (
        <>
            <Header/>
        </>
    )
}