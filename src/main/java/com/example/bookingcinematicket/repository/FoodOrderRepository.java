package com.example.bookingcinematicket.repository;

import com.example.bookingcinematicket.dtos.statistic.IKeyValueStatistic;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookingcinematicket.entity.FoodOrder;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {

    @Query(value = "with food_revenues as (\n" +
            "    select\n" +
            "        fo.food_id,\n" +
            "        sum(fo.quantity * fo.price) as revenue,\n" +
            "        SUM(sum(fo.quantity * fo.price)) over() as total_revenue\n" +
            "    from food_orders fo\n" +
            "    join bookings b on b.booking_id = fo.booking_id\n" +
            "    where month(b.booking_date) = month(CURRENT_DATE)\n" +
            "    group by fo.food_id\n" +
            ")\n" +
            "select\n" +
            "    f.food_name AS keyV,\n" +
            "    ROUND((revenue * 100.0 / total_revenue), 2) AS value\n" +
            "from food_revenues fr join foods f on f.food_id = fr.food_id\n" +
            "order by value limit 5", nativeQuery = true)
    List<IKeyValueStatistic<String, Double>> getTop5Food();
}
