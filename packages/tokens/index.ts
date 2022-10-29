import { createHmac } from 'node:crypto';

export const generate = async(id: string, secret: string) => {
    const first = Buffer.from(id).toString('base64');
    const second = Buffer.from(String(BigInt(Date.now()) + BigInt(1667073478))).toString('base64');
    const third = createHmac('sha256', secret).update(first + second).digest('hex');
    return first + '.' + second + '.' + third;
};