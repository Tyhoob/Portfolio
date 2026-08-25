import type { IPlanet } from "../base/planet.js";
import type { addPlanetModel } from "../request/addPlanetModel.js";
import type { PlanetViewModel } from "../response/PlanetViewModel.js";


export function planetToViewModel(planet: IPlanet): PlanetViewModel{
    const viewPlanet: PlanetViewModel = {
        id: planet.id,
        name: planet.name,
        location: planet.location
    }
    return viewPlanet
}

export function addPlanetModelToPlanet(postModel: addPlanetModel): IPlanet{
    const planet: IPlanet = {
        id: -1,
        name: postModel.name,
        location: postModel.location,
        age: postModel.age
    }
    return planet
}

export function updatePlanetModelToPlanet(postModel: addPlanetModel): IPlanet{
    const planet: IPlanet = {
        id: -1,
        name: postModel.name,
        location: postModel.location,
        age: postModel.age
    }
    return planet
}