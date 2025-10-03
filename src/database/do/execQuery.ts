import pool from "../init_Database";
import { QueryStatus } from "../types";


export default
async (query: string, params: any[] = []): Promise<[any | null, QueryStatus]> => {
    const client = await pool.connect();
    try {
        const res = await client.query(query, params);
        return [res, QueryStatus.SUCCESS];
    } catch (err) {
        console.error('Database query error:', err);
        return [null, QueryStatus.FAILED];
    } finally {
        client.release();
    }
}
