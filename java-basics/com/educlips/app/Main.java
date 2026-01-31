package com.educlips.app;

import com.educlips.model.User;
import com.educlips.model.Role;

public class Main {
    public static void main(String[] args) {

        User user1 = new User(
            "Ritesh",
            "ritesh@email.com",
            "secret123",
            Role.STUDENT
        );

        System.out.println(user1.getEmail());
        System.out.println(user1.getRole());

        user1.changePassword("newpass456");
        System.err.println("Password changed successfully");
    }
}
