package com.fitness.gateway.user;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserService {
    private final WebClient userServicWebClient;

    public Mono<Boolean> validateUser(String userId) {
        return userServicWebClient.get()
            .uri("/api/users/{userId}/validate", userId)
            .retrieve()
            .bodyToMono(Boolean.class)
            .onErrorResume(WebClientResponseException.class, e -> {
                if (e.getStatusCode() == HttpStatus.NOT_FOUND) 
                {
                    return Mono.error(new RuntimeException("User Not Found"));
                } 
                else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) 
                {
                    return Mono.error(new RuntimeException("Invalid Request"));
                }
                return Mono.error(new RuntimeException("Unexpected error"));
            });
    }

    public Mono<UserResponse> registerUser(RegisterRequest request) {
        return userServicWebClient.post()
            .uri("/api/users/register")
            .bodyValue(request)
            .retrieve()
            .bodyToMono(UserResponse.class)
            .onErrorResume(WebClientResponseException.class, e -> {
                if (e.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR) 
                {
                    return Mono.error(new RuntimeException("error"));
                } 
                else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) 
                {
                    return Mono.error(new RuntimeException("Invalid Request"));
                }
                return Mono.error(new RuntimeException("Unexpected error"));
            });
    }
    
}
