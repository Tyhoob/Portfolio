package com.project.demo.controller;

import com.project.demo.model.mapper.ItemMapper;
import com.project.demo.model.model.Item;
import com.project.demo.model.request.AddItemEntryRequest;
import com.project.demo.model.response.ItemResponse;
import com.project.demo.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
public class ItemController {

    ItemRepository itemRepository;

    @Autowired
    public ItemController(ItemRepository itemRepository){
        this.itemRepository = itemRepository;
    }

    @PostMapping("/items")
    public ResponseEntity<ItemResponse> addItemEntry(@RequestBody AddItemEntryRequest request){
        Item item = ItemMapper.addItemEntryRequestToItem(request);
        try {
            ItemResponse new_item = ItemMapper.ItemToItemResponse(itemRepository.addItemEntry(item));
            return ResponseEntity.ok(new_item);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/items/{id}")
}
