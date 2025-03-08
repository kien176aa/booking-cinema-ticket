package com.example.bookingcinematicket.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

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

    public void validateInput(){

    }
}
