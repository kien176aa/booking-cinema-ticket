package com.example.bookingcinematicket.dtos;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonDTO {
    private Long personId;
    private String name;
    private LocalDate birthDate;
    private String nationality;
    private String biography;
    private String imageUrl;
    private Boolean status;

    public void validateInput() {}
}
