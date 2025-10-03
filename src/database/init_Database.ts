import { Pool } from "pg";


const pool = new Pool({
    connectionString: process.env.DATABASE_URI,
});
export default pool;


(async () => {
    const client = await pool.connect();
    try {
        const res = await client.query("SELECT NOW()");
        console.log("Connected to Postgres, server time:", res.rows[0]);
    } finally {
        client.release();
    }
})();
