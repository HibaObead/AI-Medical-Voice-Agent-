"use client"
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { UserDetailsContext } from '@/context/UserDetailsContext';

export type UserDetails = {
    name: string;
    email: string;
    credits: number;
}
function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>): React.ReactNode {

    const { user } = useUser();
    const [userDetails, setUserDetails] = useState<any>();
    useEffect(() => {
        user && CreateNewUser();
    }, [user]);
    const CreateNewUser = async () => {
        const result = await axios.post('/api/users');
        console.log(result.data);
        // setUserDetails(result.data);
    }
    return (
        <div>{children}
            {/* <UserDetailsContext.Provider
                value={{ userDetails, setUserDetails }}>
                {children}
            </UserDetailsContext.Provider> */}
        </div>
    )
}

export default Provider