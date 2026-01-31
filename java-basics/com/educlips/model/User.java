package com.educlips.model;

public class User {

    private String name;
    private String email;
    private String password;
    private Role role;

    public User(String name, String email, String password, Role role) {

        if (password.length() < 6) {
            throw new IllegalArgumentException("Password too short");
        }

        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public void changePassword(String newPassword) {
    if (newPassword == null || newPassword.length() < 6) {
        throw new IllegalArgumentException("Password too short");
    }
    this.password = newPassword;
}

}
