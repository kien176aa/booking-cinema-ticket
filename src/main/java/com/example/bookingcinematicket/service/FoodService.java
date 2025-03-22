package com.example.bookingcinematicket.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.bookingcinematicket.constants.SystemMessage;
import com.example.bookingcinematicket.dtos.FoodDTO;
import com.example.bookingcinematicket.dtos.common.SearchRequest;
import com.example.bookingcinematicket.dtos.common.SearchResponse;
import com.example.bookingcinematicket.entity.Food;
import com.example.bookingcinematicket.exception.CustomException;
import com.example.bookingcinematicket.repository.FoodRepository;
import com.example.bookingcinematicket.utils.ConvertUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FoodService {
    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private ImgurService imgurService;

    public SearchResponse<List<FoodDTO>> search(SearchRequest<String, Food> request) {
        if (request.getCondition() != null)
            request.setCondition(request.getCondition().toLowerCase().trim());
        Page<Food> foods = foodRepository.search(request.getCondition(), request.getPageable(Food.class));
        SearchResponse<List<FoodDTO>> response = new SearchResponse<>();
        response.setData(ConvertUtils.convertList(foods.getContent(), FoodDTO.class));
        response.setPageSize(request.getPageSize());
        response.setPageIndex(request.getPageIndex());
        response.setTotalRecords(foods.getTotalElements());
        return response;
    }

    public FoodDTO getFoodById(Long id) {
        Food food = foodRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.FOOD_NOT_FOUND));
        return ConvertUtils.convert(food, FoodDTO.class);
    }

    public FoodDTO create(FoodDTO dto, MultipartFile file) {
        log.info("Creating food {}", dto);
        boolean exists = foodRepository.existsByFoodName(dto.getFoodName());
        if (exists) {
            throw new CustomException(SystemMessage.FOOD_NAME_IS_EXISTED);
        }
        if (file != null) {
            try {
                dto.setImage(imgurService.uploadImageToImgur(file));
            } catch (Exception ex) {
                throw new CustomException(SystemMessage.ERROR_500);
            }
        }
        Food food = ConvertUtils.convert(dto, Food.class);
        food.setStatus(true);
        foodRepository.save(food);
        return ConvertUtils.convert(food, FoodDTO.class);
    }

    public FoodDTO update(Long id, FoodDTO dto, MultipartFile file) {
        Food food = foodRepository.findById(id).orElseThrow(() -> new CustomException(SystemMessage.FOOD_NOT_FOUND));

        Food nameExists = foodRepository.existsByFoodNameAndFoodIdNot(dto.getFoodName(), id);
        if (nameExists != null) {
            throw new CustomException(SystemMessage.FOOD_NAME_IS_EXISTED);
        }
        if (file != null) {
            try {
                food.setImage(imgurService.uploadImageToImgur(file));
            } catch (Exception ex) {
                throw new CustomException(SystemMessage.ERROR_500);
            }
        }
        food.setFoodName(dto.getFoodName());
        food.setPrice(dto.getPrice());
        food.setStatus(dto.getStatus());
        foodRepository.save(food);
        return ConvertUtils.convert(food, FoodDTO.class);
    }

    public List<FoodDTO> getActiveFood() {
        List<Food> foods = foodRepository.getActive();
        return ConvertUtils.convertList(foods, FoodDTO.class);
    }
}
