package com.example.bookingcinematicket.service;

import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.PersonDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Person;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.PersonRepository;
import com.example.bookingcinematicket.repository.RoleRepository;
import com.example.bookingcinematicket.utils.ConvertUtils;

@Service
@Slf4j
public class PersonService {
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private ImgurService imgurService;

    @Autowired
    private FileUploadService fileUploadService;

    public SearchResponse<List<PersonDTO>> search(SearchRequest<String, Person> request) {
        if (request.getCondition() != null) {
            request.setCondition(request.getCondition().trim().toLowerCase());
        }
        Page<Person> persons = personRepository.search(request.getCondition(), request.getPageable(Person.class));

        SearchResponse<List<PersonDTO>> response = new SearchResponse<>();
        response.setData(ConvertUtils.convertList(persons.getContent(), PersonDTO.class));
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(persons.getTotalElements());
        return response;
    }

    public SearchResponse<List<PersonDTO>> searchActivePerson(SearchRequest<String, Person> request) {
        if (request.getCondition() != null) {
            request.setCondition(request.getCondition().trim().toLowerCase());
        }
        Page<Person> persons =
                personRepository.searchActivePerson(request.getCondition(), request.getPageable(Person.class));

        SearchResponse<List<PersonDTO>> response = new SearchResponse<>();
        response.setData(ConvertUtils.convertList(persons.getContent(), PersonDTO.class));
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(persons.getTotalElements());
        return response;
    }

    public PersonDTO getById(Long id) {
        Person person =
                personRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.PERSON_NOT_FOUND));
        return ConvertUtils.convert(person, PersonDTO.class);
    }

    public PersonDTO create(PersonDTO req, MultipartFile file) {
        Person person = ConvertUtils.convert(req, Person.class);
        if (file != null) {
//            person.setImageUrl(imgurService.uploadImageToImgur(file));
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String fileName = fileUploadService.generateFileName(SystemMessage.IMG_POSTER);
            person.setImageUrl(fileUploadService.getUploadDir() + fileName + extension);
            fileUploadService.uploadFile(file, true, fileName).exceptionally(ex -> {
                log.error("Upload file lỗi: {}", ex.getMessage(), ex);
                return null;
            });
        }
        personRepository.save(person);

        return ConvertUtils.convert(person, PersonDTO.class);
    }

    public PersonDTO update(Long id, PersonDTO personDTO, MultipartFile file) {
        Person person =
                personRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.PERSON_NOT_FOUND));
        if (file != null) {
//            person.setImageUrl(imgurService.uploadImageToImgur(file));
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String fileName = fileUploadService.generateFileName(SystemMessage.IMG_POSTER);
            person.setImageUrl(fileUploadService.getUploadDir() + fileName + extension);
            fileUploadService.uploadFile(file, true, fileName).exceptionally(ex -> {
                log.error("Upload file lỗi: {}", ex.getMessage(), ex);
                return null;
            });
        }
        person.setName(personDTO.getName());
        person.setBiography(personDTO.getBiography());
        person.setBirthDate(personDTO.getBirthDate());
        person.setNationality(personDTO.getNationality());
        person.setStatus(personDTO.getStatus());

        personRepository.save(person);
        return ConvertUtils.convert(person, PersonDTO.class);
    }
}
