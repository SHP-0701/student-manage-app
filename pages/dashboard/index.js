import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import SideMenu from "@/components/SideMenu";
import DashboardContent from "@/components/DashboardContent";
import styles from '@/styles/Dashboard.module.css';

export default function Dashboard() {
    const [userName, setUserName] = useState('');
    const router = useRouter();

    useEffect(() => {
        const name = sessionStorage.getItem('username');

        if(!name) {
            router.push('/');
        } else {
            setUserName(name);
        }
    }, []);

    return (
        <div className={styles.dashboardContainer}>
            <SideMenu username={userName} />
            <DashboardContent />
        </div>
    )
} 