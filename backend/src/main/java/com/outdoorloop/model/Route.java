package com.outdoorloop.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO why no @column for these?
    private String name;
    private String description;

    @Column(columnDefinition = "TEXT")
    private String path;
}
