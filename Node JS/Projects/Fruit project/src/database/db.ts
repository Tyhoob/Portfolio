import { Fruit } from '../models/base/Fruit'

export type DBType = {
    fruits: Fruit[]
}

export const db: DBType = {
    fruits: [
        {id: 1, name:'apple', amount: 3, producer: 'Chipple'},
        {id: 2, name:'banana', amount: 5, producer: 'MySons'},
        {id: 3, name:'kiwi', amount: 20, producer: 'Happies'}
    ]
}
