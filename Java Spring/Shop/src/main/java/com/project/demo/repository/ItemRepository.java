package com.project.demo.repository;

import com.project.demo.model.model.Item;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class ItemRepository {

    final String ADD_ITEM_ENTRY = "INSERT INTO Item ('name', 'shopId', 'amount') VALUES (?, ?, ?)";

    final String BUY_ITEM =
            "UPDATE Item " +
            "SET amount = amount - ? " +
            "WHERE id = ?, shopId = ?";

    final String BUY_ITEM_CHECK =
            "SELECT * FROM Items " +
            "WHERE id = ?";

    DataSource dataSource;

    public ItemRepository(DataSource dataSource){
        this.dataSource = dataSource;
    }

    public Item addItemEntry(Item item) throws SQLException {
        try (final PreparedStatement statement = dataSource.getConnection().prepareStatement(ADD_ITEM_ENTRY)){
            statement.setString(1, item.name);
            statement.setInt(2, item.shopId);
            statement.setInt(3, item.amount);

            statement.executeUpdate();

            final ResultSet result = statement.getGeneratedKeys();
            if (result.next()){
                item.id = result.getInt(1);
            }
            return item;
        } catch (SQLException e){
            e.printStackTrace();
            throw e;
        }
    }

    public Item buyItem(Item item) throws SQLException {
        try (final PreparedStatement statement = dataSource.getConnection().prepareStatement(BUY_ITEM)){
            statement.setInt(1,item.amount);
            statement.setInt(2,item.id);
            statement.setInt(3,item.shopId);

            statement.executeUpdate();

        } catch (SQLException e){
            e.printStackTrace();
            throw e;
        }

        try (final PreparedStatement statement = dataSource.getConnection().prepareStatement(BUY_ITEM_CHECK)){
            statement.setInt(1,item.id);

            statement.executeQuery();

        } catch (SQLException e){
            e.printStackTrace();
            throw e;
        }
    }
}
