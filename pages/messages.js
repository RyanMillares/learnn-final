import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";
import Header from "../components/Header";

export default function messages() {
    return (
        <>
            <Header currPage = "messages"/>
        </>
    )
}