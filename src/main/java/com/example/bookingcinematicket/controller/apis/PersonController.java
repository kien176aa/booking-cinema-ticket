package com.example.bookingcinematicket.controller.apis;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.bookingcinematicket.controller.BaseController;
import com.example.bookingcinematicket.dtos.PersonDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Person;
import com.example.bookingcinematicket.service.PersonService;

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
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public PersonDTO createBranch(
            @ModelAttribute PersonDTO personDTO, @RequestPart(value = "file", required = false) MultipartFile file) {
        return personService.create(personDTO, file);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@securityService.hasPermission('ROLE_ADMIN')")
    public PersonDTO updateBranch(
            @PathVariable("id") Long id,
            @ModelAttribute PersonDTO personDTO,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return personService.update(id, personDTO, file);
    }
}
