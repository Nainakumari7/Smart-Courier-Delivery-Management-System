package com.smartcourier.authservice.security.services;

import com.smartcourier.authservice.entity.Role;
import com.smartcourier.authservice.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class UserDetailsImplTest {

    @Test
    public void testBuild() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@test.com");
        user.setPassword("password");
        user.setRole(Role.ROLE_CUSTOMER);
        user.setBlocked(false);

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);

        assertEquals(1L, userDetails.getId());
        assertEquals("testuser", userDetails.getUsername());
        assertEquals("test@test.com", userDetails.getEmail());
        assertEquals("password", userDetails.getPassword());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isCredentialsNonExpired());
        assertTrue(userDetails.isEnabled());
        assertEquals(Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER")), userDetails.getAuthorities());
    }

    @Test
    public void testEquals() {
        UserDetailsImpl user1 = new UserDetailsImpl(1L, "u1", "e1", "p1", false, true, null);
        UserDetailsImpl user2 = new UserDetailsImpl(1L, "u1", "e1", "p1", false, true, null);
        UserDetailsImpl user3 = new UserDetailsImpl(2L, "u1", "e1", "p1", false, true, null);

        assertEquals(user1, user2);
        assertNotEquals(user1, user3);
        assertNotEquals(user1, null);
        assertNotEquals(user1, new Object());
    }
}
