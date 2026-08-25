import type { Pool, RowDataPacket as RDP} from "mysql2/promise";
import type { IPlanet } from "../model/base/planet.js";
import { BaseRepository } from "./baseRepository.js";

export class PlanetRepository extends BaseRepository {
    protected SQL = {
        FIND_BY_SUBSTRING: 'SELECT * FROM planet WHERE INSTR(location, ?) > 0',
        FIND_ALL: 'SELECT * FROM planet',
        FIND_BY_ID: 'SELECT * FROM planet WHERE id = ?',
        CREATE: 'INSERT INTO Planet (name, age, location) VALUES (?,?,?)',
        UPDATE: `UPDATE Planet 
            SET name = ?,
                age = ?,
                location = ?
            WHERE id = ?`,
        DELETE: `DELETE FROM Planet WHERE id = ?`
    } as const;

    constructor(db: Pool){
        super(db)
    }

    async findPlanets(searchLocation: string | undefined): Promise<IPlanet[]> {
        let foundPlanets: IPlanet[]
        if (searchLocation){
            foundPlanets = await this.fetchAll<IPlanet>(this.SQL.FIND_BY_SUBSTRING,[searchLocation])
        } else {
            foundPlanets = await this.fetchAll<IPlanet>(this.SQL.FIND_ALL)
        }
        return foundPlanets
    }

    async findPlanetById(id: number): Promise<IPlanet | undefined> {
        const planet = await this.fetchOne<IPlanet>(this.SQL.FIND_BY_ID, [id])
        return planet
    }

    async createPlanet(newPlanet: IPlanet): Promise<IPlanet> {
        const { name, age, location } = newPlanet;
        const newID = await this.insertOne(this.SQL.CREATE,[name,age,location])
        const createdPlanet = await this.findPlanetById(newID)

        if (!createdPlanet) {
            throw new Error(`Could not get created planet after its creation (ID: ${newID})`);
        }
        return createdPlanet
    }

    async updatePlanet(id: number, planet: IPlanet): Promise<IPlanet | undefined>{
        const { name, age, location } = planet;
        const affectedRows = await this.updateOne(this.SQL.UPDATE,[name,age,location,id])
        if (affectedRows === 0){
            return undefined
        }
        const updatedPlanet = await this.findPlanetById(id)
        return updatedPlanet
    }

    async deletePlanet(id: number): Promise<boolean> {
        const affectedRows = await this.deleteOne(this.SQL.DELETE,[id])
        return affectedRows > 0
    }
}