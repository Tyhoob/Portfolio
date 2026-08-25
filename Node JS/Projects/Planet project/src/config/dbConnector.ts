import { createPool, type Pool } from 'mysql2/promise'

export async function createDatabasePool(): Promise<Pool> {
    const pool: Pool = createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'mydatabase',
        port: 3306
    })
    return pool
}

