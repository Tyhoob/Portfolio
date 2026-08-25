import type { Pool, ResultSetHeader, RowDataPacket, } from "mysql2/promise";

export abstract class BaseRepository {

    constructor(protected db: Pool){
        this.db = db
    }

    protected async fetchAll<T>(sql: string, params: any[] = []): Promise<T[]> {
        const [rows] = await this.db.execute<T[] & RowDataPacket[]>(sql, params);
        return rows;
    }

    protected async fetchOne<T>(sql: string, params: any[] = []): Promise<T | undefined> {
        const [rows] = await this.db.execute<T[] & RowDataPacket[]>(sql, params);
        return rows[0];
    }

    protected async insertOne<T>(sql: string, params: any[] = []): Promise<number>{
        const [result] = await this.db.execute<ResultSetHeader>(sql, params);
        return result.insertId
    }

    protected async updateOne<T>(sql: string, params: any[] = []): Promise<number>{
        const [result] = await this.db.execute<ResultSetHeader>(sql, params);
        return result.affectedRows
    }

    protected async deleteOne<T>(sql: string, params: any[] = []): Promise<number>{
        const [result] = await this.db.execute<ResultSetHeader>(sql, params);
        return result.affectedRows
    }
}