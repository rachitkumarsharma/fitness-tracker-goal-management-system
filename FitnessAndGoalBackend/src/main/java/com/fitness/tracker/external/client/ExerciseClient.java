package com.fitness.tracker.external.client;

import com.fitness.tracker.external.dto.ExerciseDTO;
import com.fitness.tracker.external.dto.ExerciseSearchRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.net.URI;
import java.time.Duration;
import java.util.Collections;
import java.util.List;

/**
 * WebClient-based API client for consuming the API Ninjas Exercise API.
 * Handles HTTP communication, error handling, retries, and logging.
 */
@Slf4j
@Component
public class ExerciseClient {

    private final WebClient webClient;
    private final String baseUrl;
    private final String apiKey;

    public ExerciseClient(
            WebClient.Builder webClientBuilder,
            @Value("${api.ninjas.base-url}") String baseUrl,
            @Value("${X-Api-Key}") String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.webClient = webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    /**
     * Search exercises by muscle group.
     */
    public List<ExerciseDTO> searchByMuscle(String muscle) {
        log.debug("Fetching exercises for muscle: {}", muscle);
        return callApi(ExerciseSearchRequest.builder().muscle(muscle).build());
    }

    /**
     * Search exercises by name.
     */
    public List<ExerciseDTO> searchByName(String name) {
        log.debug("Fetching exercises by name: {}", name);
        return callApi(ExerciseSearchRequest.builder().name(name).build());
    }

    /**
     * Search exercises by difficulty level.
     */
    public List<ExerciseDTO> searchByDifficulty(String difficulty) {
        log.debug("Fetching exercises by difficulty: {}", difficulty);
        return callApi(ExerciseSearchRequest.builder().difficulty(difficulty).build());
    }

    /**
     * Search exercises by type.
     */
    public List<ExerciseDTO> searchByType(String type) {
        log.debug("Fetching exercises by type: {}", type);
        return callApi(ExerciseSearchRequest.builder().type(type).build());
    }

    /**
     * Core method that calls the API Ninjas Exercise endpoint with given parameters.
     * Implements timeout handling, retry mechanism, and comprehensive error handling.
     */
    private List<ExerciseDTO> callApi(ExerciseSearchRequest request) {
        try {
            URI uri = buildUri(request);

            List<ExerciseDTO> response = webClient.get()
                    .uri(uri)
                    .header("X-Api-Key", apiKey)
                    .retrieve()
                    .bodyToFlux(ExerciseDTO.class)
                    .collectList()
                    .timeout(Duration.ofSeconds(10))
                    .retryWhen(Retry.backoff(2, Duration.ofSeconds(1))
                            .filter(throwable -> throwable instanceof WebClientResponseException.TooManyRequests
                                    || throwable instanceof java.io.IOException)
                            .onRetryExhaustedThrow((retryBackoffSpec, retrySignal) -> retrySignal.failure()))
                    .onErrorResume(WebClientResponseException.class, ex -> {
                        log.error("API Ninjas HTTP error: {} {} - {}", ex.getStatusCode(), ex.getStatusText(), ex.getResponseBodyAsString());
                        return Mono.just(Collections.emptyList());
                    })
                    .onErrorResume(Exception.class, ex -> {
                        log.error("API Ninjas call failed: {}", ex.getMessage());
                        return Mono.just(Collections.emptyList());
                    })
                    .block();

            log.debug("Received {} exercises from API Ninjas", response != null ? response.size() : 0);
            return response != null ? response : Collections.emptyList();

        } catch (Exception e) {
            log.error("Unexpected error calling API Ninjas: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Builds the URI with query parameters from the search request.
     */
    private URI buildUri(ExerciseSearchRequest request) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(baseUrl);

        if (request.getMuscle() != null && !request.getMuscle().isBlank()) {
            builder.queryParam("muscle", request.getMuscle().toLowerCase());
        }
        if (request.getName() != null && !request.getName().isBlank()) {
            builder.queryParam("name", request.getName().toLowerCase());
        }
        if (request.getDifficulty() != null && !request.getDifficulty().isBlank()) {
            builder.queryParam("difficulty", request.getDifficulty().toLowerCase());
        }
        if (request.getType() != null && !request.getType().isBlank()) {
            builder.queryParam("type", request.getType().toLowerCase());
        }
        if (request.getOffset() != null) {
            builder.queryParam("offset", request.getOffset());
        }

        return builder.build().toUri();
    }
}

