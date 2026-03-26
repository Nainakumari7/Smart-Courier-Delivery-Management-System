package com.smartcourier.authservice.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class AuthEntityTest {

    @Test
    public void testRole() {
        Role r = Role.ROLE_ADMIN;
        assertEquals("ROLE_ADMIN", r.name());
    }

    @Test
    public void testUser() {
        User u = new User();
        u.setId(1L);
        u.setUsername("user2");
        u.setEmail("email2");
        u.setPassword("pass2");
        u.setRole(Role.ROLE_ADMIN);

        assertEquals(1L, u.getId());
        assertEquals("user2", u.getUsername());
        assertEquals("email2", u.getEmail());
        assertEquals("pass2", u.getPassword());
        assertEquals(Role.ROLE_ADMIN, u.getRole());
        
        User u2 = new User(2L, "user3", "email3", "pass3", Role.ROLE_CUSTOMER);
        assertEquals(2L, u2.getId());
        assertEquals("user3", u2.getUsername());
    }
}
