package com.outdoorloop;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class AuthControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    ResultActions registerWith(String email, String password) throws Exception {
        Map<String, String> requestBody = Map.of("username", email, "password", password);
        return mockMvc.perform(
                post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody))
        );
    }

    ResultActions loginWith(String email, String password) throws Exception {
        Map<String, String> requestBody = Map.of("username", email, "password", password);
        return mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody))
        );
    }

    @Test
    void registerWithEmptyEmail() throws Exception {
        registerWith("", "aaaaaaaA1").andExpect(status().isBadRequest());
    }

    @Test
    void registerWithInvalidEmail() throws Exception {
        registerWith("testgmail.com", "aaaaaaaA1").andExpect(status().isBadRequest());
    }

    @Test
    void registerWithInvalidPassword() throws Exception {
        registerWith("test@gmail.com", "aaaaaaaa").andExpect(status().isBadRequest());
    }

    @Test
    void registerWithValidCredentials() throws Exception {
        registerWith("test@gmail.com", "aaaaaaaA1").andExpect(status().isOk());
    }

    @Test
    void registerWithExistingEmail() throws Exception {
        registerWith("test@gmail.com", "aaaaaaaA1").andExpect(status().isOk());
        registerWith("test@gmail.com", "aaaaaaaA1").andExpect(status().isBadRequest());
    }

    @Test
    void registerWithDifferentEmails() throws Exception {
        registerWith("test@gmail.com", "aaaaaaaA1").andExpect(status().isOk());
        registerWith("test2@gmail.com", "aaaaaaaA1").andExpect(status().isOk());
    }

    @Test
    void loginWithEmptyEmail() throws Exception {
        loginWith("", "aaaaaaaA1").andExpect(status().isBadRequest());
    }

    @Test
    void loginWithUnregisteredCredentials() throws Exception {
        loginWith("test@gmail.com", "aaaaaaaA1").andExpect(status().isUnauthorized());
    }

    @Test
    void loginWithRegisteredCredentials() throws Exception {
        registerWith("test@gmail.com", "aaaaaaaA1");
        loginWith("test@gmail.com", "aaaaaaaA1")
                .andExpect(status().isOk())
                .andExpect(content().string(""))
                .andExpect(cookie().exists("token"))
                .andExpect(cookie().httpOnly("token", true))
                .andExpect(cookie().path("token", "/"));
    }
}
