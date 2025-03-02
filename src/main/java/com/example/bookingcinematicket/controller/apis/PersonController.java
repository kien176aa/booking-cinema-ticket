package com.example.bookingcinematicket.controller.apis;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.dtos.FoodDTO;
import com.example.bookingcinematicket.dtos.PersonDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.entity.Person;
import com.example.bookingcinematicket.service.FoodService;
import com.example.bookingcinematicket.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/persons")
public class PersonController extends BaseController {
    @Autowired
    private PersonService personService;

    @PostMapping("/search")
    public SearchResponse<List<PersonDTO>> search(@RequestBody SearchRequest<String, Person> request) {
        return personService.search(request);
    }

    @GetMapping("/{id}")
    public PersonDTO getById(@PathVariable Long id) {
        return personService.getById(id);
    }

    @PostMapping
    public PersonDTO createBranch(@ModelAttribute PersonDTO personDTO,
                                @RequestPart(value = "file", required = false) MultipartFile file) {
        return personService.create(personDTO, file);
    }

    @PutMapping("/{id}")
    public PersonDTO updateBranch(@PathVariable("id") Long id, @ModelAttribute PersonDTO personDTO,
                                @RequestPart(value = "file", required = false) MultipartFile file) {
        return personService.update(id, personDTO, file);
    }
}
