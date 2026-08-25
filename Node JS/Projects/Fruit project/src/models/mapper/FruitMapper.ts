import { Fruit } from "../base/Fruit";
import { FruitViewModel } from "../response/FruitViewModel";
import { UpdateFruitModel } from "../requests/UpdateFruitModel";
import { CreateFruitModel } from "../requests/CreateFruitModel";

export function fruitToViewModel(fruit: Fruit){
    const fruitViewModel: FruitViewModel = {
        id: fruit.id,
        name: fruit.name,
        amount: fruit.amount
    }
    return fruitViewModel
}

export function updateFruitModelToFruit(fruitReq: UpdateFruitModel){
    const newFruit: Fruit = {
        id: -1,
        name: fruitReq.name,
        amount: fruitReq.amount,
        producer: fruitReq.producer
    }
    return newFruit
}

export function createFruitModelToFruit(fruitReq: CreateFruitModel){
    const newFruit: Fruit = {
        id: -1,
        name: fruitReq.name,
        amount: fruitReq.amount,
        producer: fruitReq.producer
    }
    return newFruit
}