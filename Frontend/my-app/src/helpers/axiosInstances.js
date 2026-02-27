import axios from 'axios';

export const authAxios = axios.create({
    baseURL: "http://localhost:3000/user/auth",
    withCredentials: true
});

export const userAxios = axios.create({
    baseURL: "http://localhost:3000/user/profile",
    withCredentials: true
});

export const chatAxios = axios.create({
    baseURL: "http://localhost:3000/chat/chat",
    withCredentials: true
});

export const engagementAxios = axios.create({
    baseURL: "http://localhost:3000/engagement",
    withCredentials: true
});

export const eventAxios = axios.create({
    baseURL: "http://localhost:3000/events",
    withCredentials: true
});

export const registrationAxios = axios.create({
    baseURL: "http://localhost:3000/registration",
    withCredentials: true
});

export const postAxios = axios.create({
    baseURL: "http://localhost:3000/user-post/",
    withCredentials: true
});

export const rewardsAxios = axios.create({
    baseURL: "http://localhost:3000/rewards-badges",
    withCredentials: true
});

export const verificationAxios = axios.create({
    baseURL: "http://localhost:3000/verification",
    withCredentials: true
});