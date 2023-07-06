import React, {FC} from "react";
import AppShell from "./appshell";
import { AppComponentsContextWrapper } from "@/context/AppComponentsContext";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type LayoutProps = {
    children: JSX.Element
}

export const Layout: FC<LayoutProps> = ({children}) => {
    return (
        <div>

            <ToastContainer theme='colored' />
            <AppComponentsContextWrapper>
                <AppShell>
                    {children}
                </AppShell>
            </AppComponentsContextWrapper>
        </div>
    )
}