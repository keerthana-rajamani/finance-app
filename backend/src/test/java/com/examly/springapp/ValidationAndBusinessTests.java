package com.examly.springapp;

import com.examly.springapp.dto.BudgetRequest;
import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.exception.BudgetValidationException;
import com.examly.springapp.exception.InvalidNameException;
import com.examly.springapp.exception.InvalidPhoneException;
import com.examly.springapp.security.JwtUtils;
import com.examly.springapp.service.AuthService;
import com.examly.springapp.service.BudgetService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ValidationAndBusinessTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    void testInvalidNameWithNumbersThrowsException() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("John123");
        req.setEmail("valid@example.com");
        req.setPhoneNumber("9876543210");
        req.setPassword("Password@123");

        InvalidNameException ex = assertThrows(InvalidNameException.class, () -> authService.register(req));
        assertEquals("Name must not contain numbers or special characters", ex.getMessage());
    }

    @Test
    void testInvalidPhoneNot10DigitsThrowsException() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("John Doe");
        req.setEmail("valid2@example.com");
        req.setPhoneNumber("98765"); // only 5 digits
        req.setPassword("Password@123");

        InvalidPhoneException ex = assertThrows(InvalidPhoneException.class, () -> authService.register(req));
        assertEquals("Phone Number must be exactly 10 digits long", ex.getMessage());
    }

    @Test
    void testNegativeBudgetThrowsException() {
        BudgetRequest req = new BudgetRequest();
        req.setCategory("Food");
        req.setBudgetAmount(new BigDecimal("-100"));

        BudgetValidationException ex = assertThrows(BudgetValidationException.class, () -> budgetService.saveBudget(req));
        assertEquals("Budget must be a positive number", ex.getMessage());
    }

    @Test
    void testJwtTokenGenerationAndClaims() {
        String token = jwtUtils.generateToken(1L, "john@example.com", "USER");
        assertNotNull(token);
        assertTrue(jwtUtils.validateToken(token));
        assertEquals("john@example.com", jwtUtils.getEmailFromToken(token));
        assertEquals("USER", jwtUtils.getRoleFromToken(token));
        assertEquals(1L, jwtUtils.getUserIdFromToken(token));
    }
}
