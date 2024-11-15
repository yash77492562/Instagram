'use client'

import axios from "axios";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { useEffect, useState } from "react";
import { decrypt } from "@repo/encrypt/client";

interface User {
    id: string;
    username: string;
}

export function All_user() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]); // Assume multiple users

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get('/api/getAllUser', {
                    headers: {
                        'Content-Type': 'application/json', // Corrected header
                    },
                });
                console.log(response, 'response');
                if (response.data && response.data.success) {
                    setUsers(response.data.data);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        const handleClick = async (userId: string) => {
            try {
                // Make sure to pass headers and body correctly in the axios request
                const response = await axios.post(
                    '/api/follower_relationship',
                    { userId }, // This is the body
                    {
                        headers: {
                            'Content-Type': 'application/json', // Set the content type header
                        },
                    }
                );
                console.log('Response:', response.data);
                // Reset the userId after processing
                setUserId('');
            } catch (error) {
                console.error('Error in handleClick:', error);
            }
        };

        if (userId) {
            handleClick(userId);
        }
    }, [userId]);

    return (
        <div className="w-1/2">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="w-full rounded-lg flex gap-7 overflow-x-auto hide-scrollbar justify-center items-center">
                    {users.map((user, index) => (
                        <div key={index} className="border flex flex-col justify-center items-center p-8">
                            <Card name={decrypt(user.username)} src="./image/UserImage.jpg" alt="anonymous" />
                            <Button
                                className="bg-blue-600 px-8 pt-0 w-[140px] h-[50px] text-white rounded-3xl font-medium flex justify-center items-center"
                                onClick={() => setUserId(user.id)} // Set userId to trigger useEffect
                            >
                                Follow
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
