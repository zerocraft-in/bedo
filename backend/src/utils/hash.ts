import bcrypt from "bcryptjs";

export const hashData = async (
 value: string
) => bcrypt.hash(value, 10);

export const compareData = async (
 value: string,
 hash: string
) => bcrypt.compare(value, hash);