'use server';

import { collections, dbConnect } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const postUser = async (payload) => {
    const { email, password, name } = payload;
    if (!email || !password) {
        return {
            success: false,
        };
    }
    const isExist = await dbConnect(collections.USERS).findOne({ email });
    if (isExist) {
        return {
            success: false,
        };
    }
    const newUser = {
        provider: "credentials",
        name,
        email,
        password: await bcrypt.hash(password, 14),
        role: "user",
    };

    const result = await dbConnect(collections.USERS).insertOne(newUser);
    return {
        ...result,
        insertedId: result.insertedId?.toString(),
    };
};
