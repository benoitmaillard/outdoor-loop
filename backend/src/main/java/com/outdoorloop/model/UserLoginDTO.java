package com.outdoorloop.model;

import com.outdoorloop.validation.UniqueEmail;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserLoginDTO {
    @Email
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}