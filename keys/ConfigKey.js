import fs from 'fs'
export const privateKey = fs.readFileSync('./keys/private.key', 'utf8');
export const publicKey = fs.readFileSync('./keys/public.key', 'utf8');