package com.example.demo.repository;

import com.example.demo.exceptions.UserNotFoundException;
import com.example.demo.model.User;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class UserRepository {

    final String GET_USER_BY_LOGIN = "SELECT * FROM User WHERE login = ?";
    final String INSERT_USER = "INSERT INTO User ('login', 'name', 'regTime') VALUES (?,?,?)";

    DataSource dataSource;

    public UserRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public User getUserByLogin(String login) throws SQLException {
        try (final PreparedStatement statement = dataSource.getConnection().prepareStatement(GET_USER_BY_LOGIN)) {
            statement.setString(1, login);

            final ResultSet result = statement.executeQuery();

            if (result.next()) {
                final String name = result.getString("name");
                final String regTime = result.getString("regTime");

                return new User(login, name, regTime);
            }

            throw new UserNotFoundException("User not found by login = '" + login + "'");
        } catch (SQLException e) {
            throw e;
        }
    }

    public User addUser(User user) throws SQLException {
        try (PreparedStatement statement = dataSource.getConnection().prepareStatement(INSERT_USER)) {
            statement.setString(1, user.login);
            statement.setString(2, user.name);
            statement.setString(3, user.regTime);
            statement.executeUpdate();
            return user;
        }
    }
}
