package com.project.demo.model.mapper;

import com.project.demo.model.model.Item;
import com.project.demo.model.request.AddItemEntryRequest;
import com.project.demo.model.response.ItemResponse;

public class ItemMapper {
    public static Item addItemEntryRequestToItem(AddItemEntryRequest request){
        Item item = new Item();
        item.name = request.name;
        item.shopId = request.shopId;
        item.amount = request.amount;
        return item;
    }

    public static ItemResponse ItemToItemResponse(Item item){
        ItemResponse response = new ItemResponse();
        response.name = item.name;
        response.id = item.id;
        response.shopId = item.shopId;
        response.amount = item.amount;
        return response;
    }
}
