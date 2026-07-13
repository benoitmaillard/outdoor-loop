package com.outdoorloop.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginDTO {
    @Email
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
