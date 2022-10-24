import * as bcrypt from 'bcrypt';

export const hash = async(password: string) => await bcrypt.hash(password, 10);
export const compare = async(password: string, hash: string) => await bcrypt.compare(password, hash);