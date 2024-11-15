import crypto from 'crypto';

const key = process.env.ENCRYPTION_KEY || process.env.NEXT_PUBLIC_ENCRYPTION_KEY ;
console.log(process.env.ENCRYPTION_KEY , 'key is this ')

export const encrypt = (data: string): string => {
    console.log(data);
    if (key === undefined) {
        return "key not found";
    }
    const iv = crypto.randomBytes(16);
    const hashedKey = crypto.createHash('sha256').update(key).digest();
    const cipher = crypto.createCipheriv('aes-256-cbc', hashedKey, iv);
    console.log(cipher);
    const encrypted = Buffer.concat([cipher.update(data, 'utf-8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (encryptedData: string): string => {
    console.log(process.env.NEXT_PUBLIC_ENCRYPTION_KEY ,'this is NEXT_PUBLIC_KEY')
    if (key === undefined) {
        return 'key not found';
    }
    try {
        const [ivHex, encryptedHex] = encryptedData.split(':');
        if (!ivHex || !encryptedHex) throw new Error('Invalid encrypted data format.');

        const iv = Buffer.from(ivHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');
        const hashedKey = crypto.createHash('sha256').update(key).digest(); 
        const decipher = crypto.createDecipheriv('aes-256-cbc', hashedKey, iv);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        return decrypted.toString('utf8');
    } catch (err) {
        console.error('Decryption failed:', err);
        throw new Error('Failed to decrypt the data');
    }
};
