package com.example.bookingcinematicket.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "persons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_id")
    private Long personId;

    @Column(nullable = false)
    private String name;

    private LocalDate birthDate;
    private String nationality;

    @Column(columnDefinition = "TEXT")
    private String biography;

    private String imageUrl;
    private Boolean status;

    @OneToMany(mappedBy = "person")
    private List<MoviePerson> moviePersons;
}
