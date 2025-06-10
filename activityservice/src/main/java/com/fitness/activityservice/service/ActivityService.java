package com.fitness.activityservice.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.repository.ActivityRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;
    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    public ActivityResponse trackActivity(ActivityRequest request) {
        boolean isValidUser = userValidationService.validateUser(request.getUserId());
        if(!isValidUser)
        {
            throw new RuntimeException("Invalid User");
        }

        Activity activity = Activity.builder()
                            .userId(request.getUserId())
                            .type(request.getType())
                            .caloriesBurned(request.getCaloriesBurned())
                            .additionalMetrics(request.getAdditionalMetrics())
                            .duration(request.getDuration())
                            .startTime(request.getStartTime())
                            .build();
        
        Activity savedActivity = activityRepository.save(activity);

        try 
        {
            rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);
        } 
        catch (Exception e) 
        {
            log.error("failed to publish activity to RabbitMq", e);
        }

        return mapToResponse(savedActivity);
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .map(activity -> mapToResponse(activity)).collect(Collectors.toList());
    }

    public ActivityResponse getActivityById(String activityId) {
        return activityRepository.findById(activityId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
    }

    private ActivityResponse mapToResponse (Activity activity)
    {
        ActivityResponse activityResponse = new ActivityResponse();

        activityResponse.setId(activity.getId());
        activityResponse.setUserId(activity.getUserId());
        activityResponse.setType(activity.getType());
        activityResponse.setCaloriesBurned(activity.getCaloriesBurned());
        activityResponse.setAdditionalMetrics(activity.getAdditionalMetrics());
        activityResponse.setDuration(activity.getDuration());
        activityResponse.setStartTime(activity.getStartTime());
        activityResponse.setCreatedAt(activity.getCreatedAt());
        activityResponse.setUpdatedAt(activity.getUpdatedAt());

        return activityResponse;
    }
}
