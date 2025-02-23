package com.example.bookingcinematicket.dtos.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResponse<T> {
    private T data;
    private Long totalRecords;
    private Integer pageSize;
    private Integer pageIndex;
}
